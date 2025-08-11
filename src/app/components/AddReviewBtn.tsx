import { Dialog, Button,Flex,Text,TextField } from "@radix-ui/themes";
import { col } from "framer-motion/client";
import { useState } from "react";
export default function AddReviewBtn() {
    const [review,setReview]=useState("")
    
    async function handelReview(){
        const obj={
            review
        }
        const url="http://localhost:3000/company/review"
        const res=await fetch(url,{
            method:"POST",
            body:JSON.stringify(obj)
        })
        const data=await res.json()
        console.log(data.data);
    }
  return (
    <div>
      <Dialog.Root>
	<Dialog.Trigger>
		<Button>Add review </Button>
	</Dialog.Trigger>

	<Dialog.Content maxWidth="450px">
		<Dialog.Title>fill the review </Dialog.Title>
		<Dialog.Description size="2" mb="4">
			Review 
		</Dialog.Description>

		<Flex direction="column" gap="3">
			<label>
				<Text as="div" size="2" mb="1" weight="bold">
					Review 
				</Text>
				<TextField.Root
					value={review}
                    onChange={e=>setReview(e.target.value)}
					placeholder="Enter your full name"
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
				<Button onClick={handelReview}>Save</Button>
			</Dialog.Close>
		</Flex>
	</Dialog.Content>
</Dialog.Root>
    </div>
  )
}
