import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FaTimes } from "react-icons/fa";
import { MenuItem, OutlinedInput, Select } from "@mui/material";
import { BiPlus } from "react-icons/bi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GETAllProjects } from "../../services/Project";
import { GETDetailEvent, PATCHEditEvent } from "../../services/Event";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Edit({
  uuid,
  open,
  handleClose,
  openProject,
  setTick,
  tick,
}: {
  uuid: string;
  open: boolean;
  handleClose: () => void;
  setTick: (e: number) => void;
  tick: number;
  openProject: (e: boolean) => void;
}) {
  const [project, setProject] = React.useState([]);

  const { handleChange, handleSubmit, setFieldValue, resetForm, values } =
    useFormik({
      initialValues: {
        time: {
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
        },
        eventTitle: "",
        projectName: "",
      },
      onSubmit: async (val) => {
        const data = {
          uuid,
          time: {
            startDate: val.time.startDate,
            endDate: val.time.endDate,
            startTime: val.time.startTime,
            endTime: val.time.endTime,
          },
          eventTitle: val.eventTitle,
          projectName: val.projectName,
        };

        const fetching = await PATCHEditEvent(data);

        if (fetching.isSuccess) {
          resetForm();
          setTick(tick + 1);
          handleClose();
          return Swal.fire({
            title: "Edit Event",
            text: fetching.data.message,
            timer: 2000,
            icon: "success",
          });
        }

        return Swal.fire({
          title: "Edit Event",
          text: fetching.data.message,
          timer: 2000,
          icon: "error",
        });
      },
      validationSchema: Yup.object().shape({
        time: Yup.object().shape({
          startDate: Yup.string().required(),
          endDate: Yup.string().required(),
          startTime: Yup.string().required(),
          endTime: Yup.string().required(),
        }),
        eventTitle: Yup.string().required(),
        projectName: Yup.string().required(),
      }),
    });

  const fetchData = async () => {
    const fetchingProject = await GETAllProjects();

    const project = fetchingProject.data.data.map((item: any) => {
      return {
        title: item.name,
      };
    });

    const data = {
      uuid,
    };

    const fetchingEvent = await GETDetailEvent(data);

    values.time.startDate = dayjs(
      fetchingEvent.data.data.time.startDate
    ).format("YYYY-MM-DD");
    values.time.endDate = dayjs(fetchingEvent.data.data.time.endDate).format(
      "YYYY-MM-DD"
    );
    values.time.startTime = fetchingEvent.data.data.time.startTime;
    values.time.endTime = fetchingEvent.data.data.time.endTime;
    values.eventTitle = fetchingEvent.data.data.eventTitle;
    values.projectName = fetchingEvent.data.data.projectName;

    setProject(project);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

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
            <span>Tambah Kegiatan Baru</span>{" "}
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
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="flex flex-col">
                <label htmlFor="time.startDate">
                  Tanggal Mulai <span className="text-red-400">*</span>
                </label>
                <OutlinedInput
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingX: "12px",
                      paddingY: "14px",
                    },
                  }}
                  id="time.startDate"
                  name="time.startDate"
                  type="date"
                  onChange={handleChange}
                  value={values.time.startDate}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="time.endDate">
                  Tanggal Berakhir <span className="text-red-400">*</span>
                </label>
                <OutlinedInput
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingX: "12px",
                      paddingY: "14px",
                    },
                  }}
                  id="time.endDate"
                  name="time.endDate"
                  type="date"
                  onChange={handleChange}
                  value={values.time.endDate}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="time.startTime">
                  Jam Mulai <span className="text-red-400">*</span>
                </label>
                <OutlinedInput
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingX: "12px",
                      paddingY: "14px",
                    },
                  }}
                  id="time.startTime"
                  name="time.startTime"
                  type="time"
                  onChange={handleChange}
                  value={values.time.startTime}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="time.endTime">
                  Jam Berakhir <span className="text-red-400">*</span>
                </label>
                <OutlinedInput
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingX: "12px",
                      paddingY: "14px",
                    },
                  }}
                  id="time.endTime"
                  name="time.endTime"
                  type="time"
                  onChange={handleChange}
                  value={values.time.endTime}
                />
              </div>
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="eventTitle">
                Judul Kegiatan <span className="text-red-400">*</span>
              </label>
              <OutlinedInput
                sx={{
                  "& .MuiOutlinedInput-input": {
                    paddingX: "12px",
                    paddingY: "14px",
                  },
                }}
                id="eventTitle"
                onChange={handleChange}
                value={values.eventTitle}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="projectName">
                Nama Proyek <span className="text-red-400">*</span>
              </label>
              <Select
                labelId="projectName"
                id="projectName"
                name="projectName"
                onChange={(e) => {
                  setFieldValue("projectName", e.target.value);
                }}
                value={values.projectName}
              >
                <MenuItem
                  value={""}
                  onClick={() => {
                    handleClose();
                    openProject(true);
                  }}
                >
                  <BiPlus color="red" />{" "}
                  <span className="text-red-400">Tambah Proyek</span>
                </MenuItem>
                {project.map((item: any, i: number) => {
                  return (
                    <MenuItem key={i} value={item.title}>
                      {item.title}
                    </MenuItem>
                  );
                })}
              </Select>
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
