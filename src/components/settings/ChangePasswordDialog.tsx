"use client"

import { RotateCcwKey } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ChangePasswordDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-md h-12">
                    <RotateCcwKey className="size-5" />
                    Change password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change password</DialogTitle>
                    <DialogDescription>
                        Changes will apply immediately. You will have to sign in again.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                            Password
                        </Label>
                        <Input id="name" className="col-span-3" type="password" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" >
                            Repeat password
                        </Label>
                        <Input id="username" className="col-span-3" type="password" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Update password</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
