import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import prisma from "@/libs/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
	try {
		const { message } = await req.json();
		const msg = message.toLowerCase();
		
		// Get user session
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ 
				response: "Please login to use the AI assistant", 
				type: "error" 
			});
		}

		// Get user details
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				name: true,
				downloads: {
					select: {
						post: {
							select: {
								title: true,
								subject: {
									select: { subject_name: true }
								}
							}
						}
					},
					take: 5,
					orderBy: { createdAt: 'desc' }
				}
			}
		});

		// Get subject statistics
		const subjectStats = await prisma.subject.findMany({
			select: {
				subject_name: true,
				_count: {
					select: {
						posts: {
							where: { status: 'approved' }
						}
					}
				}
			}
		});

		// Format available subjects
		const subjects = subjectStats
			.filter(s => s?._count?.posts > 0)
			.map(s => ({
				name: s.subject_name,
				count: s._count.posts
			}));

		// Get recent downloads
		const recentDownloads = (user?.downloads || [])
			.filter(d => d?.post?.subject?.subject_name)
			.map(d => ({
				subject: d.post.subject.subject_name,
				title: d.post.title
			}));

		// Create response
		let response;
		const userName = user?.name || "there";

		// Helper function to find subject
		const findSubject = (query) => {
			return subjects.find(s => 
				s.name.toLowerCase().includes(query.toLowerCase())
			);
		};

		if (msg.includes('hello') || msg.includes('hi')) {
			response = `Hi ${userName}! I can help you find study materials. Try asking about specific subjects or type "list" to see all available materials.`;
		}
		else if (msg.includes('list') || msg.includes('show all') || msg.includes('available')) {
			const subjectList = subjects
				.map(s => `${s.name}: ${s.count} posts`)
				.join('\n');
			response = `${userName}, here are all available materials:\n\n${subjectList}`;
		}
		else if (msg.includes('how many')) {
				response = `We have ${subjects.reduce((sum, s) => sum + s.count, 0)} posts across ${subjects.length} subjects.`;
		}
		else if (msg.includes('subject') || msg.includes('materials for')) {
			const query = msg.replace(/materials for|subject|show|tell|me|about/gi, '').trim();
			const subject = findSubject(query);
			
			if (subject) {
				response = `${userName}, there are ${subject.count} posts available for ${subject.name}.`;
			} else {
				response = `Sorry ${userName}, I couldn't find any materials for "${query}". Try asking about another subject or type "list" to see all available materials.`;
			}
		}
		else if (msg.includes('recent')) {
			if (recentDownloads.length > 0) {
				const recentList = recentDownloads
					.map(d => `- ${d.subject}: ${d.title}`)
					.join('\n');
				response = `${userName}, here are your recent downloads:\n\n${recentList}`;
			} else {
				response = `${userName}, you haven't downloaded any materials yet. Type "list" to see available materials.`;
			}
		}
		else {
			response = `${userName}, I can help you find study materials. Try:\n- Asking about specific subjects\n- Type "list" to see all materials\n- "recent" to see your history`;
		}

		// Save conversation
		await prisma.aIConversation.create({
			data: {
				userId: session.user.id,
				query: message,
				response,
				type: 'general',
				context: JSON.stringify({ 
					userName: user?.name,
					recentDownloads,
					subjects 
				})
			}
		});

		return NextResponse.json({
			response,
			type: "success"
		});

	} catch (error) {
		console.error('AI Assistant error:', error);
		return NextResponse.json({
			response: "I'm having trouble understanding that. Try asking about specific subjects or type 'list' to see all materials.",
			type: "error"
		}, { status: 500 });
	}
}

// Get chat history
export async function GET(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const conversations = await prisma.aIConversation.findMany({
			where: { userId: session.user.id },
			orderBy: { timestamp: 'desc' },
			take: 50
		});

		return NextResponse.json(conversations);
	} catch (error) {
		console.error("Error fetching history:", error);
		return NextResponse.json(
				{ error: "Failed to fetch history" },
				{ status: 500 }
		);
	}
}

// Clear chat history
export async function DELETE(req) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await prisma.aIConversation.deleteMany({
			where: { userId: session.user.id }
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error clearing history:", error);
		return NextResponse.json(
				{ error: "Failed to clear history" },
				{ status: 500 }
		);
	}
}