import { useForm } from 'react-hook-form'
import { Link } from 'react-router';
export function LoginForm({inputClass, 
    submitClass, registerLinkContainer ,registerLinkClass , submitBtnName, isUser, isjudge}){
    const{
        register,
        handleSubmit,
        reset,
        formState : {errors},
    } = useForm();

    const onSubmit = (data)=>{
        console.log(data);
        reset(); 
    };
    return(
        <>
            <div className="container" >
            <form action='' onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
                {isUser && <input type="text" placeholder="Username" className={inputClass}
                    {...register("username",{
                        required : {value:true, message: "The field is required"},
                        minLength: {value:3, message: "Min length is 3"},
                        maxLength: {value:9, message: "Max length is 9"}
                    })} 
                />}
                {errors.username && <div style={{color : 'red' , fontSize : '15px',}} >{errors.username.message}</div>}
                <input type="email" placeholder='Email' className={inputClass}
                    {...register("email",{
                        required : {value : true , message : "The field is required",},
                        pattern : {value : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message : "Invalid email address"}
                    })}
                />
                {errors.email && <div style={{color : 'red' , fontSize : '15px',}} >{errors.email.message}</div>}
                <input type="password" id="" placeholder="Password" className={inputClass}
                    {...register("password",{
                        required : {value: true, message: "The field is required"},
                        minLength : {value: 6, message: "Min length is 6"}
                    })}
                />
                {errors.password && <div style={{color : 'red' , fontSize : '15px',}} >{errors.password.message}</div>}
                {isjudge && <div className={registerLinkContainer}>
                    <Link to="forget-pass" className={registerLinkClass}>
                          Forget your password?
                    </Link>
                </div>}
                <input type="submit" value={submitBtnName} className={submitClass} />
            </form>
            </div>
        </>  
    )
}