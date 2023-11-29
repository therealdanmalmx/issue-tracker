"use client";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/app/components";
import toast, { Toaster } from "react-hot-toast";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) {
    return <Skeleton height='2rem' />;
  }

  if (error) {
    return null;
  }

  const assignIssue = async (userId: string) => {
    try {
      const assignedToUserId = userId !== "UNASSIGNED" ? userId : null;
      await axios.patch(`/api/issues/${issue.id}`, { assignedToUserId });
    } catch (error) {
      toast.error("Change could not be saved");
    }
  };
  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || "UNASSIGNED"}
        onValueChange={assignIssue}
      >
        <Select.Trigger placeholder='Assign...' />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value='UNASSIGNED'>Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => axios.get("/api/users").then((res) => res.data),
    staleTime: 1000 * 60 * 60 * 24,
    retry: 3,
  });

export default AssigneeSelect;
