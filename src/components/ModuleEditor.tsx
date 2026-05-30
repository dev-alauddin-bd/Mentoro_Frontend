"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {

  useGetCourseBySlugQuery,
} from "@/redux/features/course/courseAPi";
import {

  useAddModuleMutation,

} from "@/redux/features/module/moduleApi";

type ModuleForm = { title: string };

export default function ModuleEditor({
  courseId: propCourseId,
}: {
  courseId: string;
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    propCourseId || null
  );


  useEffect(() => {
    setSelectedCourseId(propCourseId);
  }, [propCourseId]);

  const { data: course, refetch } = useGetCourseBySlugQuery(selectedCourseId!, {
    skip: !selectedCourseId,
  });

  const [addModule] = useAddModuleMutation();

  const { register, handleSubmit, reset } = useForm<ModuleForm>({
    defaultValues: { title: "" },
  });
  useEffect(() => {
    if (selectedCourseId) refetch();
  }, [selectedCourseId, refetch]);

  // Add Module
  const onAddModule = async (val: ModuleForm) => {
    if (!selectedCourseId) {
      toast.error("Select a course first");
      return;
    }
    const data = { courseId: selectedCourseId, title: val.title };
    try {
      await addModule(data).unwrap();
      toast.success("Module added successfully");
      reset();
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Add module failed");
    }
  };


  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-lg font-semibold mb-4">Module Editor</h3>


      {!selectedCourseId && (
        <p className="text-gray-500">Select a course to manage modules</p>
      )}

      {/* Module & Lessons */}
      {selectedCourseId && course && (
        <>
          {/* Add Module */}
          <form
            onSubmit={handleSubmit(onAddModule)}
            className="flex gap-2 mb-4"
          >
            <input
              {...register("title", { required: true })}
              placeholder="Module title"
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Module
            </button>
          </form>


        </>
      )}
    </div>
  );
}
