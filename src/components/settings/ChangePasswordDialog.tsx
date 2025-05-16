"use client"

import { AlertCircle, CheckCircle, RotateCcwKey } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserData, auth, getCurrentUser } from "@/lib/api";
import Cookies from 'js-cookie';

export function ChangePasswordDialog() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [confirming, setConfirming] = useState(false);

    // Load the current user
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    const validateForm = (): boolean => {
        // Reset error
        setError(null);

        // Check if all fields are filled
        if (!password.trim() || !confirmPassword.trim() && !currentPassword.trim()) {
            setError("All fields are required");
            return false;
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
            return false;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.userId) return;

        // Validate the form
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Clear form
            setPassword("");
            setConfirmPassword("");

            // Call the backend
            const response = await fetch("https://c9server.go.ro/messaging-api/change-password/" +
                user?.userId.toString(), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
                body: JSON.stringify({
                    "newPassword": password,
                    "currentPassword": currentPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    throw new Error("Current password is incorrect!");
                } else {
                    throw new Error(errorData.error || "Failed to change password!");
                }
            }
            // Show success message
            setSuccess("Password change successful! Redirecting to login...");

            auth.logout();

            // Redirect to login page after a short delay
            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (err) {
            console.error("Password change error:", err);
            setError(err instanceof Error ? err.message : "Password change failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                        <Label htmlFor="current-password">Current password</Label>
                        <Input
                            id="current-password"
                            type="password"
                            className="col-span-3"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">
                            New password
                        </Label>
                        <Input id="name" className="col-span-3" type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" >
                            Repeat new password
                        </Label>
                        <Input id="username" className="col-span-3" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    {confirming ? (
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setConfirming(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Click again to confirm"}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => {
                                if (validateForm()) setConfirming(true);
                            }}
                            disabled={loading}
                        >
                            Change password
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
