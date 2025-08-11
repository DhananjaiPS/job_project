import { getUserFromCookie } from "@/app/Helper/helper"
import prismaClient from "@/app/service/prisma";

export default async function Page() {

    const user = await getUserFromCookie();
    if (!user) {
        return (
            <div>No user Found</div>
        )
    }
    const applications = await prismaClient.
        application.findMany({
            where: {
                user_id: user.id
            },
            include: {
                opening:{
                    include:{
                        company:true
                        }
                    }
                }
           
        });
    if(!applications){
        return <div>No application found</div>
    }    

    return (
        <div>
            Your Applications :

            <div>
                {
                    applications.map((item,index)=>{
                        return(
                            <div>
                                <h2>{item.opening.title}</h2>

                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}