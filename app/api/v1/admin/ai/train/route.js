import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import prisma from "@/libs/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function collectTrainingData() {
    try {
        console.log('Collecting posts data...');
        const [posts, subjects, downloads, conversations] = await Promise.all([
            // Get all posts with correct relations
            prisma.post.findMany({
                where: { status: "approved" },
                include: {
                    subject: true,
                    user: {
                        select: {
                            name: true,
                            userRole: true
                        }
                    },
                    userLikes: true,    // Changed from likes to userLikes
                    userDownloads: true // Changed from downloads to userDownloads
                }
            }),
            // Get subject information
            prisma.subject.findMany({
                include: {
                    posts: true,
                    videos: true
                }
            }),
            // Get download patterns
            prisma.userDownload.findMany({
                include: {
                    user: true,
                    post: {
                        include: {
                            subject: true
                        }
                    }
                }
            }),
            // Get successful AI conversations
            prisma.aIConversation.findMany({
                where: {
                    response: { not: "" }
                },
                include: {
                    user: true
                }
            })
        ]);

        console.log('Processing collected data...');
        // Structure the data for training
        const postStats = await prisma.post.groupBy({
            by: ['status'],
            _count: true
        });

        const trainingData = {
            subjects: subjects.map(subject => ({
                name: subject.subject_name,
                code: subject.subject_code,
                course: subject.course_name,
                semester: subject.semester_code,
                postCount: subject.posts.length,
                videoCount: subject.videos.length,
                topics: [...new Set(subject.posts.map(p => p.category))]
            })),

            posts: posts.map(post => ({
                title: post.title,
                description: post.description,
                subject: post.subject?.subject_name,
                category: post.category,
                popularity: post.userLikes.length + post.userDownloads.length,
                fileType: post.file_type,
                tags: post.tags || [],
                authorRole: post.user?.userRole
            })),

            userPatterns: downloads.reduce((acc, download) => {
                const subjectName = download.post?.subject?.subject_name;
                if (subjectName) {
                    if (!acc[subjectName]) {
                        acc[subjectName] = 0;
                    }
                    acc[subjectName]++;
                }
                return acc;
            }, {}),

            successfulResponses: conversations.reduce((acc, conv) => {
                const type = conv.type || 'general';
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push({
                    query: conv.query,
                    response: conv.response,
                    context: conv.context
                });
                return acc;
            }, {}),

            statistics: {
                posts: {
                    total: postStats.reduce((acc, stat) => acc + stat._count, 0),
                    byStatus: Object.fromEntries(
                        postStats.map(stat => [stat.status, stat._count])
                    )
                }
            }
        };

        console.log('Data processing complete');
        return trainingData;

    } catch (error) {
        console.error('Error collecting training data:', error);
        throw error;
    }
}

async function generateTrainingPrompts(data) {
    try {
        console.log('Generating prompts...');
        
        // Create subject-specific knowledge base
        const subjectPrompts = data.subjects.map(subject => `
            Subject: ${subject.name} (${subject.code})
            Course: ${subject.course}
            Semester: ${subject.semester}
            Topics: ${subject.topics.join(', ')}
            Available Resources: ${subject.postCount} documents, ${subject.videoCount} videos
        `).join('\n\n');

        // Create common Q&A patterns from successful responses
        const qaPatterns = Object.entries(data.successfulResponses || {}).map(([type, responses]) => `
            Type: ${type}
            Common Queries:
            ${responses.slice(0, 5).map(r => `Q: ${r.query}\nA: ${r.response}`).join('\n\n')}
        `).join('\n\n');

        // Create popularity insights from posts
        const popularContent = data.posts
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 20)
            .map(post => `
                Title: ${post.title}
                Subject: ${post.subject}
                Category: ${post.category}
                Popularity: ${post.popularity}
            `).join('\n');

        // Create user patterns from downloads
        const userPatterns = Object.entries(data.userPatterns || {}).map(([subject, count]) => `
            Subject: ${subject}
            Downloads: ${count}
        `).join('\n');

        const statsPrompt = `
            Platform Statistics:
            - Total Posts: ${data.statistics.posts.total}
            - Approved Posts: ${data.statistics.posts.byStatus.approved || 0}
            - Pending Posts: ${data.statistics.posts.byStatus.pending || 0}
        `;

        console.log('Prompts generated successfully');
        return {
            subjectPrompts,
            qaPatterns,
            popularContent,
            userPatterns,
            statistics: statsPrompt
        };

    } catch (error) {
        console.error('Error generating prompts:', error);
        throw error;
    }
}

export async function POST(req) {
    try {
        console.log('Starting training process...');

        // Collect training data
        const trainingData = await collectTrainingData();
        console.log('Data collected:', {
            subjects: trainingData.subjects.length,
            posts: trainingData.posts.length,
            conversations: Object.values(trainingData.successfulResponses || {}).flat().length
        });

        const trainingPrompts = await generateTrainingPrompts(trainingData);
        console.log('Prompts generated');

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log('Model initialized');

        // Create training prompt
        const trainingPrompt = `
            You are an AI study assistant for Notes Mates, a student resource platform.
            Here's the knowledge base to enhance your responses:

            SUBJECT INFORMATION:
            ${trainingPrompts.subjectPrompts}

            COMMON Q&A PATTERNS:
            ${trainingPrompts.qaPatterns}

            POPULAR CONTENT:
            ${trainingPrompts.popularContent}

            USER PATTERNS:
            ${trainingPrompts.userPatterns}

            Guidelines:
            1. Use this information to provide more accurate and contextual responses
            2. Reference specific resources when available
            3. Consider subject relationships and prerequisites
            4. Maintain academic accuracy and formality
            5. Include practical examples from the knowledge base
        `;

        console.log('Saving training data...');
        await prisma.aITraining.create({
            data: {
                prompt: trainingPrompt,
                timestamp: new Date(),
                dataSnapshot: JSON.stringify(trainingData),
                status: "completed"
            }
        });

        console.log('Training completed successfully');
        return NextResponse.json({
            success: true,
            message: "Training completed successfully",
            stats: {
                subjects: trainingData.subjects.length,
                posts: trainingData.posts.length,
                conversations: Object.values(trainingData.successfulResponses || {}).flat().length
            }
        });

    } catch (error) {
        console.error("Training error:", error);
        return NextResponse.json(
            {
                error: "Training failed",
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// Get training status
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const lastTraining = await prisma.aITraining.findFirst({
            orderBy: { timestamp: 'desc' }
        });

        return NextResponse.json(lastTraining);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch training status" },
            { status: 500 }
        );
    }
}

