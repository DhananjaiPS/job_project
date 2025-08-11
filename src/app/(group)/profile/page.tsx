"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../layout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tabs, Text, Box ,Badge,Flex} from "@radix-ui/themes";
export default function Page() {
    const { user } = useContext(UserContext);
    const [applications, setApplications] = useState([])
    const [reviews, setReviews] = useState([])
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("http://localhost:3000/api/profile")
                const data = await res.json();
                console.log(data)
                if (data.success) {
                    alert(data.message)
                    setApplications(data?.data?.application)
                    setReviews(data?.data?.review)
                }
                else {
                    //fail
                    alert(data.message)

                }
            }
            catch (err: any) {
                alert(err)
            }

        }
        fetchUser();
    }, [])

    if (!user) {
        return <p className="text-center text-gray-500 mt-10">Loading user profile...</p>;
    }

    return (
        <div className="flex flex-col gap-7 justify-center items-center m-5 overflow-hidden">
            <div className="flex flex-col sm:flex-row rounded-bl-2xl bg-blue-500 w-full pt-3 sm:pb-5">

                <div className="object-left object-cover flex justify-center items-center w-[40vh] h-[40vh] sm:w-[60vh] sm:pl-20  sm:h-[50vh]  overflow-hidden">
                    <img src="/job7.png" alt="job" />
                </div>
                <div className="w-[55vh] flex flex-col  bg-white sm:w-[50%] mx-auto mt-10 p-6  rounded shadow">
                    <div className="flex  flex-col    w-full">
                        <h1 className="text-2xl font-bold mb-4 text-blue-600">User Profile</h1>

                        <div className="space-y-3">
                            <div>
                                <span className="font-semibold text-gray-700">User ID:</span>
                                <p className="text-gray-800">{user.id}</p>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700">Email:</span>
                                <p className="text-gray-800">{user.email}</p>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700">Role:</span>
                                <p className="text-gray-800 capitalize">{user.role}</p>
                            </div>

                            {user.company_id && (
                                <div>
                                    <span className="font-semibold text-gray-700">Company ID:</span>
                                    <p className="text-gray-800">{user.company_id}</p>
                                    <Link
                                        href={`/company/${user.company_id}`}
                                        className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-[33vh] sm:w-[45vh] justify-between"
                                    >
                                        View Company Profile
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>


            {/* user Applied Jobs and reviews */}
            <div className=" w-full flex justify-center gap-7 text-lg">

                <Tabs.Root defaultValue="account">
                    <Tabs.List>
                        <Tabs.Trigger value="settings">Introduction</Tabs.Trigger>
                        <Tabs.Trigger value="account">My Applications</Tabs.Trigger>
                        <Tabs.Trigger value="documents">My Reviews</Tabs.Trigger>
                    </Tabs.List>

                    <Box pt="3">
                        <Tabs.Content value="settings">
                            <Text size="2">Edit your profile or update contact information.</Text>
                        </Tabs.Content>
                        <Tabs.Content value="account">
                            
                            <Flex gap="2" direction="column">{
                                applications.map((item,index)=>{
                                    return(
                                        <Link href={`/jobs/${item.job_id}`}><Badge color="blue">{item.job_id}</Badge></Link>
                                    )
                                })
                            }</Flex>
                        </Tabs.Content>

                        <Tabs.Content value="documents">
                            <Text size="2">Access and update your documents.</Text>
                        </Tabs.Content>

                    </Box>
                </Tabs.Root>
            </div>

        </div>

    );
}
