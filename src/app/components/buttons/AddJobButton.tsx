

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
import { UserContext } from "../../(group)/layout";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AddJobButton({ scroll, onJobAdded }: { scroll: boolean, onJobAdded: (job: any) => void }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState(1); // step control

  // Step 1 fields
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setDescription] = useState("");
  const [jobEmploymentType, setEmploymentType] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobType, setJobType] = useState("");

  // Step 2 fields
  const [jobCategory, setCategory] = useState("");
  const [jobId, setJobId] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [logo, setLogo] = useState("");

  const { user, company } = useContext(UserContext);
  const [isPending, startTransition] = useTransition();
  // console.log(user,company)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const tempId = Date.now();
    const optimisticJob = {
      id: tempId, // temporary ID
      title: jobTitle,
      description: jobDescription,
      salary: Number(jobSalary),
      job_type: jobType,
      employment_type: jobEmploymentType,
      location: jobLocation,
      company_id: company?.id,
      company: company,
      // extra fields
      category: jobCategory,
      job_id: jobId,
      apply_link: applyLink,
      responsibilities,
      qualifications,
      logo,
    };

    // 1. Immediately update parent
    onJobAdded?.(optimisticJob);


    try {
      startTransition(async () => {
        const res = await fetch("/api/addJobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(optimisticJob),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Job added successfully!");
          // reset fields
          onJobAdded?.({ ...data.job, tempId });
          // (you can modify parent to replace tempId with actual DB id)

          setJobTitle("");
          setDescription("");
          setEmploymentType("");
          setJobLocation("");
          setJobSalary("");
          setJobType("");
          setCategory("");
          setJobId("");
          setApplyLink("");
          setResponsibilities("");
          setQualifications("");
          setLogo("");


          setStep(1);
          setOpen(false);
          router.push("/addJobs");
        } else {
          alert(data.message || "Something went wrong!");
        }
      });
    } catch (error) {
      alert("Server Error: " + error);
      onJobAdded?.({ removeTempId: tempId });

    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Button trigger */}
      <Dialog.Trigger>
        <button
          className={
            scroll
              ? "w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700"
              : "w-[30vh] h-[7vh] bg-white text-blue-600 text-xl p-2 font-semibold rounded hover:bg-blue-700 hover:text-white"
          }
        >
          {scroll ? <FaPlus size={20} /> : "Add Job"}
        </button>
      </Dialog.Trigger>

      {/* Dialog content */}
      <Dialog.Content maxWidth="500px">
        <Dialog.Title>Add New Job</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {step === 1
            ? "Fill the basic job details."
            : "Add additional job information."}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
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

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button type="button" onClick={() => setStep(2)}>
                  Next
                </Button>
              </Flex>
            </Flex>
          )}

          {step === 2 && (
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Category
                </Text>
                <TextField.Root
                  value={jobCategory}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Software, Marketing"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Job ID
                </Text>
                <TextField.Root
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder="Enter job ID"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Apply Link
                </Text>
                <TextField.Root
                  value={applyLink}
                  onChange={(e) => setApplyLink(e.target.value)}
                  placeholder="Enter application link"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Responsibilities
                </Text>
                <TextField.Root
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="List responsibilities"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Qualifications
                </Text>
                <TextField.Root
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="Enter required qualifications"
                />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Logo URL
                </Text>
                <TextField.Root
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="Paste company logo URL"
                />
              </label>

              <Flex gap="3" mt="4" justify="end">
                <Button type="button" variant="soft" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Submitting..." : "Save Job"}
                </Button>
              </Flex>
            </Flex>
          )}
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
