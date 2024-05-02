import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FaTimes } from "react-icons/fa";
import { OutlinedInput } from "@mui/material";
import { useFormik } from "formik";
import { POSTCreateProject } from "../../services/Project";
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Proyek({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { handleChange, resetForm, handleSubmit, values } = useFormik({
    initialValues: {
      projectName: "",
    },
    onSubmit: async (val: any) => {
      const data = {
        name: val.projectName,
      };

      const fetching = await POSTCreateProject(data);

      if (fetching.isSuccess) {
        resetForm();
        handleClose();
        return Swal.fire({
          title: "Create Project",
          text: fetching.data.message,
          timer: 2000,
          icon: "success",
        });
      }

      return Swal.fire({
        title: "Create Project",
        text: fetching.data.message,
        timer: 2000,
        icon: "error",
      });
    },
  });

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth={"md"}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="border-b-2">
          <div className="flex items-center justify-between ">
            <span>Tambah Proyek Baru</span>{" "}
            <button
              className="cursor-pointer hover:bg-gray-100 rounded-full p-2"
              onClick={handleClose}
            >
              <FaTimes />
            </button>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="py-4">
            <div className="flex flex-col mb-3">
              <label htmlFor="projectName">
                Nama Proyek <span className="text-red-400">*</span>
              </label>
              <OutlinedInput
                sx={{
                  "& .MuiOutlinedInput-input": {
                    paddingX: "12px",
                    paddingY: "14px",
                  },
                }}
                id="projectName"
                onChange={handleChange}
                value={values.projectName}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-end items-center gap-4">
            <button onClick={handleClose} className="text-red-400">
              Kembali
            </button>
            <button
              className="bg-red-400 py-2 px-4 rounded-md text-white"
              onClick={() => {
                handleSubmit();
              }}
            >
              Simpan
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
