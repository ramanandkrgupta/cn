//route is /api/v1/public/posts/filter/[...params]/route.js

import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    // Log the full params object for debugging
    console.log('Filter params received:', params);
    
    if (!params || !params.params || !Array.isArray(params.params) || params.params.length === 0) {
      return NextResponse.json(
        { error: 'Invalid parameters. Expected at least subject_name.' },
        { status: 400 }
      );
    }
    
    const [subject_name, course_name, semester_code, category] = params.params;
    
    console.log('Parsed params:', {
      subject_name,
      course_name,
      semester_code, 
      category
    });
    
    // Build query filters
    const where = {};
    
    if (subject_name) {
      where.subject_name = decodeURIComponent(subject_name);
    } else {
      return NextResponse.json(
        { error: 'Subject name is required' },
        { status: 400 }
      );
    }
    
    if (course_name) {
      where.course_name = decodeURIComponent(course_name);
    }
    
    if (semester_code) {
      where.semester_code = decodeURIComponent(semester_code);
    }
    
    if (category) {
      where.category = decodeURIComponent(category);
    }
    
    // Show query before execution
    console.log('Executing query with filters:', where);
    
    // Execute query
    const posts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        subject_name: true,
        course_name: true,
        semester_code: true,
        category: true,
      },
      take: 10,
    });
    
    console.log('Found posts count:', posts.length);
    
    // Return response in the expected format
    return NextResponse.json({
      posts,
      meta: {
        total: posts.length,
        filters: where,
      }
    });
    
  } catch (error) {
    console.error('Error in filter API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
