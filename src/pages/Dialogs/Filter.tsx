import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FaTimes } from "react-icons/fa";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { GETAllProjects } from "../../services/Project";
import { useFormik } from "formik";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Filter({
  open,
  handleClose,
  setProject,
}: {
  open: boolean;
  handleClose: () => void;
  setProject: (e: string[]) => void;
}) {
  const [data, setData] = React.useState([]);

  const { handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: {
      projectName: [],
    },
    onSubmit: async (val: any) => {
      const filtProject = val.projectName.map((i: any) => i.title);

      setProject(filtProject);

      resetForm();

      handleClose();
    },
  });

  const fetchData = async () => {
    const fetching = await GETAllProjects();

    const data = fetching.data.data.map((item: any, i: number) => {
      return {
        id: i + 1,
        title: item.name,
      };
    });

    setData(data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="border-b-2">
          <div className="flex items-center justify-between ">
            <span>Filter</span>{" "}
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
            <label htmlFor="Proyek">
              Proyek <span className="text-red-400">*</span>
            </label>
            <Autocomplete
              multiple
              limitTags={2}
              id="Proyek"
              options={data}
              filterSelectedOptions
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.title}
                  </li>
                );
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.title}
                  />
                ));
              }}
              getOptionLabel={(option: any) => option.title}
              getOptionKey={(option: any) => option.id}
              // defaultValue={[{ title: "1" }]}
              // value={}
              onChange={(e, v) => {
                e;
                setFieldValue("projectName", v);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} placeholder="Proyek" />
              )}
              sx={{ width: "500px" }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-end items-center gap-4">
            <button onClick={handleClose} className="text-red-400">
              Hapus Filter
            </button>
            <button
              className="bg-red-400 py-2 px-4 rounded-md text-white"
              onClick={() => {
                handleSubmit();
              }}
            >
              Terapkan
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
