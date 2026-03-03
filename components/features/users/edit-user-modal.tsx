"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react"; // Import the icons!
import { editUserSchema } from "@/lib/validations";
import { User } from "./user-table";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const EditUserModal = ({ isOpen, onClose, user }: EditUserModalProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  // Add state for toggling visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { department: "", firstName: "", lastName: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        department: user.department,
        firstName: user.firstName,
        lastName: user.lastName,
        password: "",
        confirmPassword: "",
      });
    }
  }, [isOpen, user, form]);

  const handleClose = () => {
    setIsChangingPassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  function onSubmit(values: z.infer<typeof editUserSchema>) {
    const payload = {
      ...values,
      ...(isChangingPassword ? {} : { password: undefined, confirmPassword: undefined })
    };
    console.log("Ready for Supabase Update:", payload);
    handleClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 py-8 border-b border-gray-100 flex justify-center items-center">
          <DialogTitle className="text-2xl font-medium text-gray-900">
            Edit User: {user?.id}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
              
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn("h-11 w-full rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-0", !field.value && "text-gray-400")}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Purchasing">Purchasing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">First Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-11 w-full rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0" />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 ml-1" />
                </FormItem>
              )} />

              <div className="flex items-end gap-3 pt-2">
                <div className="flex-1">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} type={showPassword ? "text" : "password"} disabled={!isChangingPassword} placeholder="••••••••" className="h-11 w-full pr-10 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0 disabled:bg-gray-50" />
                          <button type="button" disabled={!isChangingPassword} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 ml-1" />
                    </FormItem>
                  )} />
                </div>
                {!isChangingPassword && (
                  <Button type="button" variant="outline" className="h-11 rounded-xl font-semibold border-gray-200 hover:bg-gray-50 text-gray-600" onClick={() => setIsChangingPassword(true)}>
                    Change
                  </Button>
                )}
              </div>

              {isChangingPassword && (
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="h-11 w-full pr-10 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-0" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1" />
                  </FormItem>
                )} />
              )}
            </div>

            <DialogFooter className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="px-8 h-11 rounded-xl font-bold text-gray-500 hover:text-gray-900">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0f172a] text-white px-10 h-11 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-[#0f172a]/70">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};