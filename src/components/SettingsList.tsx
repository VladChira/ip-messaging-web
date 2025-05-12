import { CircleHelp, KeyRound, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Link from "next/link";

const SettingsList = () => {
    return (
        <div className="flex-1 p-2">
            <div className="space-y-2 pt-1">
                <div className="py-2 rounded-md hover:bg-muted cursor-pointer pb-5">
                    <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
                        <Avatar className="h-13 w-13">
                            <AvatarImage src="/test" alt="vc" />
                            <AvatarFallback>vc</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold truncate text-lg">Vlad Chira</p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">@vchira</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-3" />


                <div className="rounded-md hover:bg-muted cursor-pointer">
                    <Link href="/settings/account">
                        <div className="flex items-center gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
                            <KeyRound className="size-7" strokeWidth={1.6} />

                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">

                                    <p className="font-semibold truncate text-lg">Account</p>

                                </div>
                                <p className="text-sm text-muted-foreground truncate">Account info, delete account</p>
                            </div>
                        </div>
                    </Link>
                </div>

                <Separator />


                <div className="rounded-md hover:bg-muted cursor-pointer">
                    <div className="flex items-center gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
                        <CircleHelp className="size-7" strokeWidth={1.6} />

                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold truncate text-lg">Help</p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">Help center, contact devs, privacy policy</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="py-2 rounded-md hover:bg-muted cursor-pointer">
                    <div className="flex items-start gap-3 rounded-md hover:bg-muted cursor-pointer p-2">
                        <LogOut className="size-7" strokeWidth={1.6} color="#cc2a1f" />

                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold truncate text-lg">Log out</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />
            </div>
        </div>
    );
}

export default SettingsList;