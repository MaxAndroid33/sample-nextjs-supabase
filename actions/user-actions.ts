"use server";

import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { Profile } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Get Supabase instance


// 🟢 Get Current User Profile
export async function getCurrentUserProfile() {
   const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: No user found");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  return profile;
}

// 🔵 Get All Users (Admin Only)
export async function getAllUsers() {
  const adminCheck = await getCurrentUserProfile();
  if (adminCheck?.role !== "admin") throw new Error("Access Denied");

  return await prisma.profile.findMany();
}

// 🟠 Create a New User (Admin Only)
export async function createUser(user:Profile) {
  const supabase = await createClient();
  const {
    error,
  } = await supabase.auth.admin.createUser(user);
  revalidatePath("/");

  if (error) {
    throw new Error(error.message);
  }
}

// 🟡 Update User Role (Admin Only)
export async function updateUser(user:Profile) {
  const adminCheck = await getCurrentUserProfile();
  if (adminCheck?.role !== "admin") throw new Error("Access Denied");

  const updatedUser = await prisma.profile.update({
    where: { id: user.id },
    data:  user,
  });
  revalidatePath("/");
  return updatedUser;
}

// 🔴 Delete User (Admin Only)
export async function deleteUser(userId: string) {
  const adminCheck = await getCurrentUserProfile();
  if (adminCheck?.role !== "admin") throw new Error("Access Denied");

  const deletedUser = await prisma.profile.delete({
    where: { id: userId },
  });
  revalidatePath("/");
  return deletedUser;
}
