"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  Button,
  Flex,
  TextField,
  Select,
  Text,
} from "@radix-ui/themes";

export default function EditJobFormModal({
  job,
  onSave,
  onCancel,
}: {
  job: any;
  onSave: (job: any) => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Prefill job fields
  const [jobTitle, setJobTitle] = useState(job.title || "");
  const [jobDescription, setDescription] = useState(job.description || "");
  const [jobEmploymentType, setEmploymentType] = useState(
    job.employment_type || ""
  );
  const [jobLocation, setJobLocation] = useState(job.location || "");
  const [jobSalary, setJobSalary] = useState(job.salary || "");
  const [jobType, setJobType] = useState(job.job_type || "");
  const [jobCategory, setCategory] = useState(job.category || "");
  const [jobId, setJobId] = useState(job.job_id || "");
  const [applyLink, setApplyLink] = useState(job.apply_link || "");
  const [responsibilities, setResponsibilities] = useState(
    job.responsibilities || ""
  );
  const [qualifications, setQualifications] = useState(
    job.qualifications || ""
  );
  const [logo, setLogo] = useState(job.logo || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const updatedJob = {
      ...job,
      id: job.id,
      title: jobTitle,
      description: jobDescription,
      salary: Number(jobSalary),
      job_type: jobType,
      employment_type: jobEmploymentType,
      location: jobLocation,
      category: jobCategory,
      job_id: jobId,
      apply_link: applyLink,
      responsibilities,
      qualifications,
      logo,
    };

    startTransition(async () => {
      const res = await fetch(`/api/company/latestJob`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });

      try {
        const data = await res.json();
        if (data.success) {
          alert("Job updated successfully!");
          onSave?.(data.data);
          setOpen(false);
        } else {
          alert(data.message || "Something went wrong!");
        }
      } catch {
        alert("Invalid response from server");
      }
    });
  }

  // ✅ JSX should be returned here
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) onCancel();
      }}
    >
      <Dialog.Content maxWidth="500px">
        <Dialog.Title>Edit Job</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {step === 1
            ? "Update the basic details."
            : "Update additional details."}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Flex direction="column" gap="3">
              <label>
                <Text weight="bold">Title</Text>
                <TextField.Root
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Enter job title"
                />
              </label>

              <label>
                <Text weight="bold">Description</Text>
                <TextField.Root
                  value={jobDescription}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter job description"
                />
              </label>

              <Flex direction="column" gap="2">
                <Text weight="bold">Job Type</Text>
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
                <Text weight="bold">Employment Type</Text>
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
                <Text weight="bold">Location</Text>
                <TextField.Root
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  placeholder="Enter location"
                />
              </label>

              <label>
                <Text weight="bold">Salary</Text>
                <TextField.Root
                  type="number"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  placeholder="Enter salary"
                />
              </label>

              <Flex justify="end" gap="3" mt="4">
                <Button type="button" onClick={() => setStep(2)}>
                  Next
                </Button>
              </Flex>
            </Flex>
          )}

          {step === 2 && (
            <Flex direction="column" gap="3">
              <label>
                <Text weight="bold">Category</Text>
                <TextField.Root
                  value={jobCategory}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </label>

              <label>
                <Text weight="bold">Job ID</Text>
                <TextField.Root
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                />
              </label>

              <label>
                <Text weight="bold">Apply Link</Text>
                <TextField.Root
                  value={applyLink}
                  onChange={(e) => setApplyLink(e.target.value)}
                />
              </label>

              <label>
                <Text weight="bold">Responsibilities</Text>
                <TextField.Root
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                />
              </label>

              <label>
                <Text weight="bold">Qualifications</Text>
                <TextField.Root
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
              </label>

              <label>
                <Text weight="bold">Logo URL</Text>
                <TextField.Root
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
              </label>

              <Flex justify="end" gap="3" mt="4">
                <Button type="button" variant="soft" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </Flex>
            </Flex>
          )}
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
