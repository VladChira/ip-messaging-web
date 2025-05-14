"use client"

import { useState } from "react";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { auth, api } from "@/lib/api";

export function DeleteAccountDialog() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            setError(null);
            
            // Call the API to delete the user account
            await api.delete('/users/delete-account');
            
            // Log the user out
            auth.logout();
            
            // Close the dialog
            setIsOpen(false);
            
            // Redirect to register page
            router.push("/register");
            
        } catch (err) {
            console.error("Failed to delete account:", err);
            setError("Failed to delete your account. Please try again later.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-md h-12">
                    <CircleX className="size-5 mr-2" />
                    Delete my account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="pt-2">
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                
                {error && (
                    <div className="bg-red-50 p-3 rounded-md text-red-500 text-sm mb-2">
                        {error}
                    </div>
                )}
                
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Yes, I am sure, delete my account."}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}