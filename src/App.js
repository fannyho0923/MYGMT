import "./App.css";
import { useReactToPrint } from "react-to-print";
import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  createRef,
} from "react";
import dayjs from "dayjs";
import { groupBy, isEmpty } from "lodash-es";
import { ExcelRenderer } from "react-excel-renderer";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getTimeText,
  getRangeArr,
  getIArr,
  getJArr,
  getMaxBsv,
  getIDiet,
  getIval,
  getDval,
  getPCval,
  getDietContent,
  getXMin,
  getXMax,
} from "../src/utils";
import AssignTable from "../src/Container/AssignTable";
import RecordSheet from "../src/Container/RecordSheet";
import { Line } from "react-chartjs-2";
import {
  Input,
  FormGroup,
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const RowRadioButtonsGroup = ({ onChange = () => {} }) => {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={onChange}
      >
        <FormControlLabel
          value="allDays"
          control={<Radio />}
          label="整合各天數"
        />
        <FormControlLabel
          value="oneDay"
          control={<Radio />}
          label="一日完整報告"
        />
      </RadioGroup>
    </FormControl>
  );
};

const initTimes = {
  startDateTime: "",
  startDay1Time: "",
  startDay2Time: "",
  startDay3Time: "",
  startDay4Time: "",
  startDay5Time: "",
  endDay1Time: "",
  endDay2Time: "",
  endDay3Time: "",
  endDay4Time: "",
  endDay5Time: "",
};

const initRecords = [
  {
    title: `第一餐`,
    dietContent: "",
    iDiet: "",
    remarks: { iVal: false, dVal: false, pcVal: false },
  },
  {
    title: `第二餐`,
    dietContent: "",
    iDiet: "",
    remarks: { iVal: false, dVal: false, pcVal: false },
  },
  {
    title: `第三餐`,
    dietContent: "",
    iDiet: "",
    remarks: { iVal: false, dVal: false, pcVal: false },
  },
  {
    title: `第四餐`,
    dietContent: "",
    iDiet: "",
    remarks: { iVal: false, dVal: false, pcVal: false },
  },
  {
    title: `第五餐`,
    dietContent: "",
    iDiet: "",
    remark: "",
    remarks: { iVal: false, dVal: false, pcVal: false },
  },
];

const MainDoc = React.memo(({ handleReset }) => {
  const ref = createRef();
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });
  const [rawData, setRawData] = useState([]);
  const [chart, setChart] = useState([]);
  const [charts, setCharts] = useState([]);
  const [oneChart, setOneChart] = useState([]);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedChart, setSelectedChart] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [dayVal, setDayVal] = useState([]);
  const [times, setTimes] = useState(initTimes);

  const [records, setRecords] = useState(initRecords);

  const [listDay, setListDay] = useState([]);

  const handleChangeChart = (event) => {
    setSelectedChart(event.target.value);
  };

  const handleChangeTime = (e, name) => {
    if (name.includes("start")) {
      // 計算3小時後的時間
      const startDayTime = name.replace("start", "");
      const endDayTime = `end${startDayTime}`;
      const endTime = dayjs(e).add(3, "hour");
      setTimes((prevState) => ({
        ...prevState,
        [endDayTime]: endTime,
      }));
    }
    setTimes((prevState) => ({
      ...prevState,
      [name]: e,
    }));
  };

  const fileInput = useRef();
  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const handleChangeDate = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = (selectedDateTime) => {
    if (rawData.length === 0) {
      alert("請選擇匯入Excel");
      return;
    }

    if (selectedChart === "") {
      alert("請選擇整合各天數或一日完整報告");
      return;
    }
    if (isNaN(selectedDateTime)) {
      alert("請選擇開始時間段");
      return;
    }

    if (selectedChart === "oneDay") {
      if (selectedDate === "") {
        alert("請選擇第幾天");
        return;
      }
    }

    const alignedData = new Array(listDay.length * 1440).fill("");
    for (let i = 0; i < rawData.length; i++) {
      let idx = listDay.findIndex(
        (val) => Number(val) === Number(rawData[i][0])
      );
      alignedData[rawData[i][1] * 60 + rawData[i][2] + 1440 * idx] = rawData[i];
    }

    const alignedArr = [];

    for (let i = 0; i < listDay.length - 1; i++) {
      alignedArr.push([
        `${listDay[i]}`,
        alignedData.slice(
          selectedDateTime + i * 1440,
          selectedDateTime + 1440 + i * 1440
        ),
      ]);
    }

    const alignedCharts = [];
    console.log(selectedDateTime);
    alignedArr.map((row) => {
      const tmpArr = [];
      for (let idx = 0; idx < row[1].length; idx++) {
        tmpArr.push({
          x: row[1][idx][1] * 60 + row[1][idx][2],
          y: row[1][idx][3],
          bsv: row[1][idx][3] / 18,
          dietContent: row[1][idx][4] || "",
        });
      }
      alignedCharts.push({
        label: row[0],
        data: {
          labels: new Array(1440).fill(0).map((_, i) => {
            let h =
              Math.trunc(selectedDateTime / 60) +
              Math.trunc((i + (selectedDateTime % 60)) / 60);
            while (h >= 24) {
              h -= 24;
            }
            const m =
              ((selectedDateTime % 60) + i) % 60 < 10
                ? `0${((selectedDateTime % 60) + i) % 60}`
                : ((selectedDateTime % 60) + i) % 60;
            const tmpLabel = `${h}:${m}`;
            return tmpLabel;
          }),
          datasets: [
            {
              label: row[0],
              data: tmpArr,
              borderColor: "rgb(22, 88, 146)",
              backgroundColor: "rgba(22, 88, 146, 0.5)",
              pointStyle: false,
            },
          ],
        },
      });
    });

    setCharts(alignedCharts);
    setOneChart(alignedCharts.find((item) => item.label === selectedDate));
    if (!isEmpty(alignedCharts) && selectedChart === "allDays") {
      setChart(alignedCharts);
    } else {
      setChart([alignedCharts.find((item) => item.label === selectedDate)]);
    }
    setShowChart(true);
  };

  const fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf(".") + 1) === "xlsx") {
        setUploadedFileName(fileName);
        setIsFormInvalid(false);
        renderFile(fileObj);
      } else {
        setUploadedFileName("");
        setIsFormInvalid(true);
      }
    }
  };

  const renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log("err");
      } else {
        setRawData(resp.rows.slice(1));
        const rows = groupBy(resp.rows.slice(1), (date) => {
          return date[0];
        });
        const tmpCharts = [];
        const selectedDateTime = 0;
        Object.entries(rows).map((row) => {
          const tmpArr = [];
          for (let idx = 0; idx < row[1].length; idx++) {
            tmpArr.push({
              x: row[1][idx][1] * 60 + row[1][idx][2],
              y: row[1][idx][3],
              bsv: row[1][idx][3] / 18,
              dietContent: row[1][idx][4] || "",
            });
          }

          tmpCharts.push({
            label: row[0],
            data: {
              labels: new Array(1440).fill(0).map((_, i) => {
                return Math.trunc(selectedDateTime / 60) % 24;
              }),
              datasets: [
                {
                  label: row[0],
                  data: tmpArr,
                  borderColor: "rgb(22, 88, 146)",
                  backgroundColor: "rgba(22, 88, 146, 0.5)",
                  pointStyle: false,
                },
              ],
            },
          });
        });
        setCharts(tmpCharts);
        setListDay(Object.keys(groupBy(tmpCharts, "label")));
      }
    });
  };

  const opts = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 24,
          color: "#2A4379",
          callback: (val, i) => {
            // 將x軸上的數字轉換為需要的標籤
            const res = times.startDateTime.$H + i / 60;
            return res >= 24 ? res - 24 : res;
          },
        },
      },
      y: {
        min: 50,
        max: 250,
      },
    },
    plugins: {
      annotation: {
        annotations: {
          box1: {
            type: "box",
            xMin: getXMin(
              dayVal,
              times.startDay1Time.$H * 60 + times.startDay1Time.$m
            ),
            xMax: getXMax(
              dayVal,
              times.startDay1Time.$H * 60 + times.startDay1Time.$m,
              times.endDay1Time.$H * 60 + times.endDay1Time.$m
            ),
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
          box2: {
            type: "box",
            xMin: getXMin(
              dayVal,
              times.startDay2Time.$H * 60 + times.startDay2Time.$m
            ),
            xMax: getXMax(
              dayVal,
              times.startDay2Time.$H * 60 + times.startDay2Time.$m,
              times.endDay2Time.$H * 60 + times.endDay2Time.$m
            ),
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
          box3: {
            type: "box",
            xMin: getXMin(
              dayVal,
              times.startDay3Time.$H * 60 + times.startDay3Time.$m
            ),
            xMax: getXMax(
              dayVal,
              times.startDay3Time.$H * 60 + times.startDay3Time.$m,
              times.endDay3Time.$H * 60 + times.endDay3Time.$m
            ),
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
          box4: {
            type: "box",
            xMin: getXMin(
              dayVal,
              times.startDay4Time.$H * 60 + times.startDay4Time.$m
            ),
            xMax: getXMax(
              dayVal,
              times.startDay4Time.$H * 60 + times.startDay4Time.$m,
              times.endDay4Time.$H * 60 + times.endDay4Time.$m
            ),
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
          box5: {
            type: "box",
            xMin: getXMin(
              dayVal,
              times.startDay5Time.$H * 60 + times.startDay5Time.$m
            ),
            xMax: getXMax(
              dayVal,
              times.startDay5Time.$H * 60 + times.startDay5Time.$m,
              times.endDay5Time.$H * 60 + times.endDay5Time.$m
            ),
            yMin: 50,
            yMax: 250,
            backgroundColor: "rgba(2, 152, 154, 0.34)",
          },
        },
      },
    },
  };

  useEffect(() => {
    setShowChart(false);
    setTimes(initTimes);
    setRecords(initRecords);
    if (selectedChart === "allDays") {
      setSelectedDate("");
      setChart(charts);
    } else {
      setChart(oneChart);
    }
  }, [selectedChart]);

  useEffect(() => {
    if (selectedDate && chart) {
      setChart([charts.find(({ label }) => label === selectedDate)]);
      setDayVal(chart[0]?.data.datasets[0].data);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && chart) {
      setDayVal(chart[0]?.data.datasets[0].data);
    }
  }, [chart, selectedDate]);

  useEffect(() => {
    setShowChart(false);
  }, [times.startDateTime]);

  useEffect(() => {
    setRecords([
      {
        title: `第一餐${getTimeText(times.startDay1Time, times.endDay1Time)}`,
        dietContent: getDietContent(
          dayVal,
          times.startDay1Time,
          times.endDay1Time
        ),
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay1Time, times.endDay1Time))
          )
        ),
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)
            ),
            getRangeArr(dayVal, times.startDay1Time, times.endDay1Time)?.shift()
              ?.bsv
          ),
        },
      },
      {
        title: `第二餐${getTimeText(times.startDay2Time, times.endDay2Time)}`,
        dietContent: getDietContent(
          dayVal,
          times.startDay2Time,
          times.endDay2Time
        ),
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay2Time, times.endDay2Time))
          )
        ),
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)
            ),
            getRangeArr(dayVal, times.startDay2Time, times.endDay2Time)?.shift()
              ?.bsv
          ),
        },
      },
      {
        title: `第三餐${getTimeText(times.startDay3Time, times.endDay3Time)}`,
        dietContent: getDietContent(
          dayVal,
          times.startDay3Time,
          times.endDay3Time
        ),
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay3Time, times.endDay3Time))
          )
        ),
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)
            ),
            getRangeArr(dayVal, times.startDay3Time, times.endDay3Time)?.shift()
              ?.bsv
          ),
        },
      },
      {
        title: `第四餐${getTimeText(
          times.startDay4Time,
          times.endDay4Time,
          times.endDay4Time
        )}`,
        dietContent: getDietContent(
          dayVal,
          times.startDay4Time,
          times.endDay4Time
        ),
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay4Time, times.endDay4Time))
          )
        ),
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)
            ),
            getRangeArr(dayVal, times.startDay4Time, times.endDay4Time)?.shift()
              ?.bsv
          ),
        },
      },
      {
        title: `第五餐${getTimeText(
          times.startDay5Time,
          times.endDay5Time,
          times.endDay5Time
        )}`,
        dietContent: getDietContent(
          dayVal,
          times.startDay5Time,
          times.endDay5Time
        ),
        iDiet: getIDiet(
          getIArr(getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)),
          getJArr(
            getIArr(getRangeArr(dayVal, times.startDay5Time, times.endDay5Time))
          )
        ),
        remark: "1",
        remarks: {
          iVal: getIval(
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)?.shift()
              ?.bsv,
            dayVal,
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)
          ),
          dVal: getDval(
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)?.pop()
              ?.bsv,
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)?.shift()
              ?.bsv
          ),
          pcVal: getPCval(
            getMaxBsv(
              getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)
            ),
            getRangeArr(dayVal, times.startDay5Time, times.endDay5Time)?.shift()
              ?.bsv
          ),
        },
      },
    ]);
  }, [dayVal, times]);

  return (
    <Box style={{ width: "100%" }}>
      <Box className="mb-4 p-4">
        <form>
          <FormGroup row>
            <Box className="flex flex-col">
              <Box className="flex space-x-2">
                <Box>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={openFileBrowser}
                  >
                    <i className="cui-file"></i> 匯入excel&hellip;
                  </Button>
                  <input
                    type={isEmpty(charts) ? "file" : "text"}
                    hidden
                    onChange={fileHandler}
                    ref={fileInput}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    style={{ padding: "10px" }}
                  />
                </Box>
                <Input
                  type="text"
                  className="form-control"
                  value={uploadedFileName}
                  readOnly
                  invalid={isFormInvalid}
                />
              </Box>
              {!isEmpty(charts) && (
                <Box className="mb-2">
                  <RowRadioButtonsGroup onChange={handleChangeChart} />
                  {!isEmpty(selectedChart) && (
                    <>
                      <Typography>選擇開始時間段</Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["TimePicker"]}>
                          <TimePicker
                            ampm={false}
                            value={times.startDateTime || null}
                            label="Basic time picker"
                            onChange={(e) =>
                              handleChangeTime(e, "startDateTime")
                            }
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </>
                  )}
                </Box>
              )}
              {selectedChart === "oneDay" && (
                <AssignTable
                  times={times}
                  listDay={listDay}
                  selectedDate={selectedDate}
                  handleDate={handleChangeDate}
                  handleTime={handleChangeTime}
                />
              )}
              <Box className="flex space-x-2 my-2">
                <Button
                  variant="contained"
                  className="w-1/3"
                  onClick={() =>
                    handleSubmit(
                      times.startDateTime.$H * 60 + times.startDateTime.$m
                    )
                  }
                >
                  確定
                </Button>
                <Button
                  variant="contained"
                  className="w-1/3"
                  onClick={handleReset}
                >
                  重置
                </Button>
                {showChart && (
                  <Button
                    variant="contained"
                    className="w-1/3"
                    onClick={handlePrint}
                  >
                    匯出PDF
                  </Button>
                )}
              </Box>
            </Box>
          </FormGroup>
        </form>
      </Box>
      <Box
        style={{ margin: "0 auto", width: "100%", height: "100%" }}
        ref={ref}
        filename="gmt.pdf"
        className="p-4"
      >
        <MainChart
          selectedChart={selectedChart}
          showChart={showChart}
          chart={chart}
          opts={opts}
          selectedDate={selectedDate}
          times={times}
          records={records}
          dayVal={dayVal}
        />
      </Box>
    </Box>
  );
});

const MainChart = ({
  selectedChart = "",
  showChart = false,
  chart = [],
  opts = {},
  selectedDate = false,
  times = {},
  records = [],
}) => {
  return (
    <>
      {showChart && (
        <Box className="mb-8">
          {chart.map((chart) => {
            const { label, data } = chart;
            return (
              <Line
                className="w-full mb-4"
                key={label}
                data={data}
                options={opts}
              />
            );
          })}
        </Box>
      )}

      {selectedChart === "oneDay" && showChart ? (
        <RecordSheet
          date={selectedDate ? dayjs(selectedDate).format("M/D") : ""}
          times={times}
          records={records}
          dayVal={chart[0]?.data.datasets[0].data}
        />
      ) : (
        ""
      )}
    </>
  );
};

function App() {
  const [count, setCount] = useState(0);
  const handleReset = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <Box key={count}>
      <MainDoc handleReset={handleReset} />
    </Box>
  );
}

export default App;
