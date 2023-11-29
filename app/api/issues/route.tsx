import { NextRequest, NextResponse } from "next/server";
import prisma from '@/prisma/client'
import { issueSchema } from "../../validationSchemas";

import authOptions from "../auth/authOptions";
import { getServerSession } from "next-auth";

export async function POST(request :NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({}, {status: 401});
    }
    const body = await request.json();
    const issueValidation = issueSchema.safeParse(body);

    if (!issueValidation.success) {
        return NextResponse.json(
            issueValidation.error.format(),
            { status: 400 }
        )
    }
    const newIssue = await prisma.issue.create({
        data: {
            title: body.title,
            description: body.description,
        }
    })
    return NextResponse.json(newIssue)
}