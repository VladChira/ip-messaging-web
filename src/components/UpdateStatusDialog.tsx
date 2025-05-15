"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import { UserData } from "@/lib/api";
import { useState, useEffect } from "react";

import Cookies from 'js-cookie';

const UpdateStatusDialog = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState("");

    const loadUser = () => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    // Load the current user
    useEffect(() => {
        loadUser();
    }, []);


    const handlePostStatusUpdate = async () => {
        if (!user?.userId) return;
        if (status == "") return;

        try {
            const response = await fetch(
                "https://c9server.go.ro/messaging-api/change-status/" +
                user?.userId.toString(),
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                    body: JSON.stringify({ "newStatus": status }),
                }
            );
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            // Store user in localStorage
            const data = await response.json()
            console.log(data);
            localStorage.setItem("user", JSON.stringify(data));

        } catch (err) {
            console.error("Failed to set status:", err);
        } finally {

        }
        loadUser();
        setOpen(false);
        window.location.reload();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline">
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Update your status
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Status Update</DialogTitle>
                    <DialogDescription>
                        Let others know what you&apos;re up to.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Input
                            id="status"
                            placeholder="What's on your mind?"
                            className="col-span-3"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button type="submit" onClick={handlePostStatusUpdate}>Post Status</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>);
}

export default UpdateStatusDialog;