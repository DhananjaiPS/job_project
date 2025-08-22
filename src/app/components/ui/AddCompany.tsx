"use client"
import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { body } from "framer-motion/client";
import { useContext, useState } from "react";
import { UserContext } from "../../(group)/layout";
import { useRouter } from "next/navigation";
export default function AddCompany() {

    const { user, setUser } = useContext(UserContext);
    console.log("user: add", user)

    const { company_id, email } = user;
    console.log("add Company btn :", company_id, email);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const route = useRouter();
    async function handelSubmit() {

        const obj = { name, description };

        try {
            const res = await fetch(" /api/company/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj),
            });

            if (!res.ok) {
                const errorText = await res.text(); //  read response safely
                console.error("Server error:", errorText);
                return;
            }

            const data = await res.json(); //  Safe to parse now
            if (data.success) {
                console.log("Response from API:", data.data);
                setUser({ ...user, company_id: data?.data?.id });
                alert(data.message)
                route.push("/")
            }
            else {
                alert(data.message)
            }

        } catch (err) {
            console.error("Failed to submit company:", err);
        }
    }




    return (
        <div>
            <Dialog.Root >
                <Dialog.Trigger>
                    <Button style={{
                        backgroundColor:"blue"
                        
                    }}>Add company</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Please enter the company details :</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        Make changes to these field.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Name
                            </Text>
                            <TextField.Root
                                defaultValue="Freja Johnsen"
                                value={name}
                                onChange={e => setName(e?.target?.value)}
                                placeholder="Enter companies full name"
                            />
                        </label>
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                description
                            </Text>
                            <TextField.Root
                                defaultValue=""
                                value={description}
                                onChange={e => setDescription(e?.target?.value)}
                                placeholder="Enter company description"
                            />
                        </label>


                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray">
                                Cancel
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button onClick={handelSubmit}>Save</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

        </div>
    )
}
