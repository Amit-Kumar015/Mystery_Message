"use client"

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Message } from '@/model/User'
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import dayjs from 'dayjs';

type onMessageDelete = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

export function MessageCard({ message, onMessageDelete }: onMessageDelete) {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<apiResponse>(`/api/delete-message/${message._id}`)

            toast.success(response.data.message)
            onMessageDelete(message._id);
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>;
            toast.error("Error", {
                description: axiosError.response?.data.message ?? 'Failed to delete message'
            })
        }
    }

    return (
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive'>
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
            <CardContent></CardContent>
        </Card>

    )
}

