"use client";
import React, { useContext, useState, useTransition } from "react";
import {
  Dialog,
  Button,
  Flex,
  TextField,
  Select,
  Text,
} from "@radix-ui/themes";
import { UserContext } from "../(group)/layout";

export default function AddJobButton() {
  const [open, setOpen] = useState(false); // ✅ Dialog open/close state

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setDescription] = useState("");
  const [jobEmploymentType, setEmploymentType] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobType, setJobType] = useState("");

  const { user } = useContext(UserContext);
  const [isPending, startTransition] = useTransition();

  console.log("user ki company ki id", user);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const Obj = {
      title: jobTitle,
      description: jobDescription,
      salary: Number(jobSalary),
      job_type: jobType,
      employment_type: jobEmploymentType,
      location: jobLocation,
      company_id: user?.company_id, // Make sure user is not undefined
    };

    try {
      startTransition(async () => {
        const res = await fetch("http://localhost:3000/api/addJobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Obj),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Job added successfully!");
          // Reset form
          setJobTitle("");
          setDescription("");
          setEmploymentType("");
          setJobLocation("");
          setJobSalary("");
          setJobType("");

          setOpen(false); // ✅ Close dialog after successful submit
        } else {
          alert(data.message || "Something went wrong!");
        }
      });
    } catch (error) {
      alert("Server Error: " + error);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button>Add Job</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Add New Job</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill the details to post a new job.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title
            </Text>
            <TextField.Root
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
            />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              value={jobDescription}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter job description"
            />
          </label>

          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="bold">
              Job Type
            </Text>
            <Select.Root
              value={jobType}
              onValueChange={(val) => setJobType(val)}
            >
              <Select.Trigger placeholder="Select job type" />
              <Select.Content>
                <Select.Item value="on site">On Site</Select.Item>
                <Select.Item value="remote">Remote</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="bold">
              Employment Type
            </Text>
            <Select.Root
              value={jobEmploymentType}
              onValueChange={(val) => setEmploymentType(val)}
            >
              <Select.Trigger placeholder="Select employment type" />
              <Select.Content>
                <Select.Item value="Internship">Internship</Select.Item>
                <Select.Item value="Full time">Full time</Select.Item>
                <Select.Item value="Part time">Part time</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Location
            </Text>
            <TextField.Root
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              placeholder="Enter location"
            />
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Salary
            </Text>
            <TextField.Root
              type="number"
              value={jobSalary}
              onChange={(e) => setJobSalary(e.target.value)}
              placeholder="Enter salary"
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Submitting..." : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
