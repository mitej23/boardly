import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import usePostQuery from "@/hooks/usePostQuery";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const { mutate, isPending, isError, error } =
    usePostQuery("/api/users/login");
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const onhandleLogin = () => {
    mutate(
      { ...userDetails },
      {
        onSuccess: (data) => {
          login(data);
        },
      }
    );
  };

  const onhandleGoogle = () => {};

  const onhandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className={cn("w-[380px]")}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              placeholder="Your Email"
              value={userDetails["email"]}
              onChange={onhandleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <p className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </p> */}
            </div>
            <Input
              name="password"
              type="password"
              required
              value={userDetails["password"]}
              onChange={onhandleInputChange}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            onClick={onhandleLogin}>
            {isPending ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Login"
            )}
          </Button>
          {isError && (
            <p className="text-red-400 text-sm font-semibold">
              * {error?.message}
            </p>
          )}
          <div className="flex items-center">
            <Separator className={cn("flex-1")} />
            <p className="px-4 text-slate-400">or</p>
            <Separator className={cn("flex-1")} />
          </div>
          <Button onClick={onhandleGoogle} variant="outline" className="w-full">
            Continue with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to={"/register"} className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
