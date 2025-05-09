import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-[100vh] items-center justify-center relative">
            {children}
        </div>
    );
}

export default AuthLayout;
