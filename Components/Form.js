import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"

export default function Form({ type }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    if (type === "register") {
      const res = await fetch("/api/auth/register/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/Chats");
      }

      if (res.error) {
        toast.error("Something went wrong");
      }
    }
    if (type === "login") {
        const res = await signIn("credentials", {
          ...data,
          redirect: false,
        })
  
        if (res.ok) {
          router.push("/Chats");
        }
  
        if (res.error) {
          toast.error("Invalid email or password");
        }
      }
  };

  


  return (
    <div className="body">
      <div className="auth">
        <div>
          <img src="/assets/logo.png" className="logo" />
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            {type === "register" && (
              <div>
                <div className="input">
                  <input
                    defaultValue=""
                    type="text"
                    placeholder="Username"
                    className="input-field"
                    {...register("username", {
                      required: "Username is required",
                      validate: (value) => {
                        if (value.length < 3) {
                          return "Username must be at least 3 characters";
                        }
                      },
                    })}
                  />
                  <PersonOutline sx={{ color: "#737373" }} />
                </div>
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>
            )}
            <div>
              <div className="input">
                <input
                  defaultValue=""
                  type="email"
                  placeholder="Email"
                  className="input-field"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                <EmailOutlined sx={{ color: "#737373" }} />
              </div>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="input">
                <input
                  defaultValue=""
                  type="password"
                  placeholder="Password"
                  className="input-field"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) => {
                      if (value.length < 6) {
                        return "Password must be at least 6 characters";
                      }
                    },
                  })}
                />
                <LockOutlined sx={{ color: "#737373" }} />
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <button className="button" type="submit">
              {type === "register" ? " Join Free" : "Lets Chat "}
            </button>
          </form>
          {type === "register" ? (
            <Link href="/" className="link">
              <p className="text-center">Already have an account sign in</p>
            </Link>
          ) : (
            <Link href="/auth/Register" className="link">
              <p className="text-center">no account Register</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
