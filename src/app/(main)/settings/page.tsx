import SettingsList from "@/components/SettingsList";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex h-full w-full p-6">
            <div className="flex flex-col max-w-md w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Settings</h1>
                </div>

                {/* Scrollable Chat List */}
                <div className="flex-1 rounded-md border p-2">
                    <div className="pt-1">
                        <SettingsList />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground">
                <Settings className="h-15 w-15 mb-2" />
                <p className="text-center">Settings</p>
            </div>
        </div>
    );
}
