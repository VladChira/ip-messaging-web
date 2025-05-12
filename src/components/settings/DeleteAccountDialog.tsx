"use client"

import { CircleX } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function DeleteAccountDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-md h-12">
                    <CircleX className="size-5" />
                    Delete my account
                </Button>

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" onClick={() => redirect("/register")}>
                        Yes, I am sure, delete my account.
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
