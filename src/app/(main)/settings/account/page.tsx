import AccountDetails from "@/components/settings/AccountDetails";
import { ChangeNameDialog } from "@/components/settings/ChangeNameDialog";
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog";
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex h-full w-full p-6">
            <div className="flex flex-col max-w-md w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Account</h1>
                </div>

                <div className="flex-1 rounded-md border p-2 space-y-2">

                    <AccountDetails showDetails={true}/>

                    <Separator className="my-3" />

                    <ChangeNameDialog />

                    <ChangePasswordDialog />

                    <DeleteAccountDialog />

                </div>

            </div>
            <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
                <Settings className="h-15 w-15 mb-2" />
                <p className="text-center">Settings</p>
            </div>
        </div >
    );
}
