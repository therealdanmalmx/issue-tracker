import { patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../auth/authOptions";

export async function PATCH(request: NextRequest,
    {params}: {params: {id: string}}) {
        const session = await getServerSession(authOptions);

        const body = await request.json();
        const validation = patchIssueSchema.safeParse(body);
        const { assignedToUserId, title, description } = body;

        if (!session) {
            return NextResponse.json({}, {status: 401});
        }

        if (!validation.success) {
            return new Response(JSON.stringify(validation.error.errors), {status: 400});
        }

        if (assignedToUserId) {
            const user = await prisma.user.findUnique({
                where: {
                    id: assignedToUserId
                }
            })

            if (!user) {
                return NextResponse.json({error: 'Invalid user'}, {status: 400});
            }
        }

        const issue = await prisma.issue.findUnique({
            where :{
                id: parseInt(params.id)
            }
        });


        if (!issue) {
            return NextResponse.json({error: 'Invalid issue'}, {status: 404});
        }

        const updatedIssue = await prisma.issue.update({
            where: {
                id: issue.id
            },
            data: {
                title,
                description,
                assignedToUserId,
            }
        });

        return NextResponse.json(updatedIssue);
    }

    export async function DELETE(request: NextRequest,
        {params}: {params: {id: string}}) {
            const session = await getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({}, {status: 401});
            }

            const issue = await prisma.issue.findUnique({
                where: {
                    id: parseInt(params.id)
                }
            });

            if (!issue) {
                return NextResponse.json({error: 'Invalid issue'}, {status: 404});
            }

            await prisma.issue.delete({
                where: {
                    id: issue.id
                }
            });
            return NextResponse.json({});
        }