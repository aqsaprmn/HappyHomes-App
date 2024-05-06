import { Box, InputAdornment, OutlinedInput, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import DataTable from "../components/Table";
import { GridColDef } from "@mui/x-data-grid";
import { PiPencil, PiPlusCircle } from "react-icons/pi";
import { BiSearch, BiTrash } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import Filter from "./Dialogs/Filter";
import Tambah from "./Dialogs/Tambah";
import Proyek from "./Dialogs/Proyek";
import { DELETEEvent, GETAllEvents } from "../services/Event";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import Swal from "sweetalert2";
import Edit from "./Dialogs/Edit";

dayjs.locale("id");
dayjs.extend(relativeTime);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type RowsTimesheet = {
  id: number;
  eventTitle: string;
  projectName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: string;
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TimesheetPage = () => {
  const [uuidEdit, setUuidEdit] = useState<string>("");
  const [tick, setTick] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const [search, setSearch] = useState<any>("");
  const [project, setProject] = useState<string[]>([]);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    event;
    setValue(newValue);
  };

  const [rows, setRows] = useState<RowsTimesheet[]>([]);

  const [openFilter, setOpenFilter] = useState(false);

  const handleClickOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [openTambah, setOpenTambah] = useState(false);

  const handleClickOpenTambah = () => {
    setOpenTambah(true);
  };

  const handleCloseTambah = () => {
    setOpenTambah(false);
  };

  const [openProyek, setOpenProyek] = useState(false);

  const handleClickOpenProyek = () => {
    setOpenProyek(true);
  };

  const handleCloseProyek = () => {
    setOpenProyek(false);
  };

  const [openEdit, setOpenEdit] = useState(false);

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const propCols: any = {
    align: "left",
    headerAlign: "left",
    flex: 1,
  };

  const columns: GridColDef[] = [
    {
      field: "eventTitle",
      headerName: "Judul Kegiatan",
      ...propCols,
    },
    {
      field: "projectName",
      headerName: "Nama Proyek",
      ...propCols,
    },
    {
      field: "startDate",
      headerName: "Tanggal Mulai",
      ...propCols,
    },
    {
      field: "endDate",
      headerName: "Tanggal Berakhir",
      ...propCols,
    },
    {
      field: "startTime",
      headerName: "Waktu Mulai",
      ...propCols,
    },
    {
      field: "endTime",
      headerName: "Waktu Berakhir",
      ...propCols,
    },
    {
      field: "duration",
      headerName: "Durasi",
      ...propCols,
    },
    {
      field: "action",
      headerName: "Aksi",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center h-full">
            <button
              className=" hover:bg-gray-200 p-2 rounded-md"
              onClick={() => {
                setUuidEdit(params.row.uuid);
                handleClickOpenEdit();
              }}
            >
              <PiPencil
                style={{ margin: "0 4px 0 4px", cursor: "pointer" }}
                size={14}
                color="red"
              />
            </button>
            <button
              className=" hover:bg-gray-200 p-2 rounded-md"
              onClick={() => {
                Swal.fire({
                  title: "Delete Event",
                  text: "Are your sure?",
                  icon: "question",
                  showConfirmButton: true,
                  confirmButtonText: "Hapus",
                  showDenyButton: true,
                  denyButtonText: "Batal",
                }).then((res) => {
                  if (res.isConfirmed) {
                    const uuid = params.row.uuid;

                    deleteEvent(uuid);
                  }
                });
              }}
            >
              <BiTrash
                style={{ margin: "0 4px 0 4px", cursor: "pointer" }}
                size={14}
                color="red"
              />
            </button>
          </div>
        );
      },
    },
  ];

  const dataFetching = async () => {
    let searchGo: {
      search: string;
      project: string[];
    } = {
      search: "",
      project: [],
    };

    if (search != "") {
      searchGo.search = search;
    }

    if (project.length > 0) {
      searchGo.project = project;
    }

    const fetching = await GETAllEvents(searchGo);

    const data = fetching.data.data.map((item: any, i: number) => {
      const durationStart = dayjs(
        `${dayjs(item.time.startDate).format("YYYY-MM-DD")} ${
          item.time.startTime
        }`
      ).format("YYYY-MM-DD HH.mm");

      const durationEnd = dayjs(
        `${dayjs(item.time.endDate).format("YYYY-MM-DD")} ${item.time.endTime}`
      ).format("YYYY-MM-DD HH.mm");

      return {
        id: i + 1,
        uuid: item.uuid,
        eventTitle: item.eventTitle,
        projectName: item.projectName,
        startDate: dayjs(item.time.startDate).format("DD MMMM YYYY"),
        endDate: dayjs(item.time.endDate).format("DD MMMM YYYY"),
        startTime: item.time.startTime,
        endTime: item.time.endTime,
        duration: dayjs(durationEnd).from(durationStart, true),
      };
    });

    setRows(data);
  };

  const deleteEvent = async (uuid: string) => {
    const data = {
      uuid,
    };

    const fetching = await DELETEEvent(data);

    if (fetching.isSuccess) {
      setTick(tick + 1);
      return Swal.fire({
        title: "Create Event",
        text: fetching.data.message,
        timer: 2000,
        icon: "success",
      });
    }

    return Swal.fire({
      title: "Create Event",
      text: fetching.data.message,
      timer: 2000,
      icon: "error",
    });
  };

  useEffect(() => {
    dataFetching();
  }, [tick, search, project]);

  return (
    <div>
      <div className=" bg-white border-b-2 py-2 px-4">
        <span className="text-red-600 font-bold">Timesheet Management</span>
      </div>
      <div>
        <div className="p-4 bg-white">
          <span className=" text-lg font-semibold">HH Timesheet</span>
        </div>
        <div>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "white",
                paddingX: 4,
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Daftar Kegiatan" {...a11yProps(0)} />
                <Tab label="Pengaturan" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="bg-white rounded-xl h-full">
                <div className="flex gap-4 py-4 px-6 border-b-2">
                  <div>
                    <p className=" text-xs text-gray-400">Nama Karyawan</p>
                    <p>Timothy Pradana</p>
                  </div>
                  <div>
                    <p className=" text-xs text-gray-400">Rate</p>
                    <p>Rp. 12.000/jam</p>
                  </div>
                </div>
                <div className="py-4 px-6 flex flex-col gap-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <div className="font-bold">Daftar Kegiatan</div>
                      <button
                        onClick={handleClickOpenTambah}
                        className="flex p-2 rounded-md items-center gap-2 text-blue-600 bg-blue-100 cursor-pointer"
                      >
                        <PiPlusCircle /> Tambah Kegiatan
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <OutlinedInput
                          sx={{
                            "& .MuiOutlinedInput-input": {
                              paddingX: "12px",
                              paddingY: "14px",
                            },
                          }}
                          id="search"
                          name="search"
                          placeholder="Cari"
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                          startAdornment={
                            <InputAdornment position="start">
                              <BiSearch />
                            </InputAdornment>
                          }
                        />
                      </div>
                      <div
                        className="rounded-md border py-4 px-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          handleClickOpenFilter();
                        }}
                      >
                        <IoFilter color="red" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <DataTable props={{ rows, columns }} />
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
                      <div className=" flex flex-col gap-2">
                        <div className=" text-blue-600">Total Durasi</div>
                        <div className=" text-blue-600 text-lg font-bold">
                          Total Pendapatan
                        </div>
                      </div>
                      <div className=" flex flex-col gap-2">
                        <div className=" text-blue-600">8 Jam 50 Menit</div>
                        <div className=" text-blue-600 text-lg font-bold">
                          Rp. 153.000
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="flex item-center justify-center">
                <div className="bg-white rounded-xl px-10 py-8 md:w-1/3 lg:w-1/4">
                  <div className="flex flex-col mb-3">
                    <label htmlFor="eventTitle">Nama Karyawan</label>
                    <OutlinedInput
                      sx={{
                        "& .MuiOutlinedInput-input": {
                          paddingX: "12px",
                          paddingY: "14px",
                        },
                      }}
                      value={"Ilham Pratama"}
                      id="eventTitle"
                    />
                  </div>
                  <div className="flex flex-col mb-3">
                    <label htmlFor="eventTitle">Rate</label>
                    <OutlinedInput
                      sx={{
                        "& .MuiOutlinedInput-input": {
                          paddingX: "12px",
                          paddingY: "14px",
                        },
                      }}
                      value={"Rp. 12.000"}
                      endAdornment={
                        <InputAdornment position="start">/jam</InputAdornment>
                      }
                      id="eventTitle"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className=" text-blue-400 bg-gray-100 rounded-md px-4 py-2">
                      Batalkan
                    </button>
                    <button className=" bg-blue-600 text-white rounded-md px-4 py-2">
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
          </Box>
        </div>
      </div>
      <Filter
        open={openFilter}
        handleClose={handleCloseFilter}
        setProject={setProject}
      />
      <Tambah
        open={openTambah}
        handleClose={handleCloseTambah}
        openProject={handleClickOpenProyek}
        setTick={setTick}
        tick={tick}
      />
      {uuidEdit != "" && (
        <Edit
          uuid={uuidEdit}
          open={openEdit}
          handleClose={handleCloseEdit}
          openProject={handleClickOpenProyek}
          setTick={setTick}
          tick={tick}
        />
      )}

      <Proyek open={openProyek} handleClose={handleCloseProyek} />
    </div>
  );
};

export default TimesheetPage;
