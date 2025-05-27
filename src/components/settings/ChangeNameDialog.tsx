"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, UserPen } from "lucide-react";
import { UserData } from "@/lib/api";

import Cookies from 'js-cookie';

export function ChangeNameDialog() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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

    const handleSubmit = async () => {
        if (!user?.userId) return;
        setLoading(true);
        try {
            setSuccess(null);
            const response = await fetch("https://c9server.go.ro/messaging-api/change-name/" +
                user?.userId.toString(), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
                body: JSON.stringify({ "newName": name }),
            });

            if (!response.ok) {
                throw new Error("Failed to update name.");
            }

            // Store user in localStorage
            const data = await response.json()
            localStorage.setItem("user", JSON.stringify(data));


        } catch (err) {
            console.error("Name change error:", err);
            setError(err instanceof Error ? err.message : "Name change failed. Please try again.");
        } finally {
            setLoading(false);
        }
        loadUser();
        window.location.reload();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-md h-12">
                    <UserPen className="size-5" />
                    Edit name
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit name</DialogTitle>
                    <DialogDescription>
                        Changes will apply immediately.
                        {error && (
                            <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 mt-3">
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 p-3 rounded-md flex items-start gap-2 mt-4">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-green-500">{success}</p>
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            New name
                        </Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
