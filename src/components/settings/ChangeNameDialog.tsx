"use client"

import { UserPen } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ChangeNameDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-md h-12">
                    <UserPen className="size-5" />
                    Edit name and username
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit name and username</DialogTitle>
                    <DialogDescription>
                        Change your name and username here.  Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            New name
                        </Label>
                        <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username">
                            New username
                        </Label>
                        <Input id="username" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
