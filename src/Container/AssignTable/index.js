import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const AssignTable = ({
  times,
  listDay,
  selectedDate,
  handleDate = () => {},
  handleTime = () => {},
}) => {
  return (
    <>
      <FormControl className="w-1/2">
        <InputLabel id="select-label">選擇第幾天</InputLabel>
        <Select
          labelId="select-label"
          id="select-date"
          value={selectedDate}
          label="選擇第幾天"
          onChange={handleDate}
        >
          {listDay.map((val) => (
            <MenuItem key={val} value={val}>
              {val}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box className="grid grid-cols-2 gap-4">
        <Box>
          <Typography>第一餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.startDay1Time || null}
                  label="第一餐開始"
                  onChange={(e) => handleTime(e, "startDay1Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.endDay1Time || null}
                  label="第一餐結束"
                  onChange={(e) => handleTime(e, "endDay1Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第二餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.startDay2Time || null}
                  label="第二餐開始"
                  onChange={(e) => handleTime(e, "startDay2Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.endDay2Time || null}
                  label="第二餐結束"
                  onChange={(e) => handleTime(e, "endDay2Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第三餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.startDay3Time || null}
                  label="第三餐開始"
                  onChange={(e) => handleTime(e, "startDay3Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.endDay3Time || null}
                  label="第三餐結束"
                  onChange={(e) => handleTime(e, "endDay3Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第四餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.startDay4Time || null}
                  label="第四餐開始"
                  onChange={(e) => handleTime(e, "startDay4Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.endDay4Time || null}
                  label="第四餐結束"
                  onChange={(e) => handleTime(e, "endDay4Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
        <Box>
          <Typography>第五餐</Typography>
          <Box className="flex space-x-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.startDay5Time || null}
                  label="第五餐開始"
                  onChange={(e) => handleTime(e, "startDay5Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  ampm={false}
                  value={times.endDay5Time || null}
                  label="第五餐結束"
                  onChange={(e) => handleTime(e, "endDay5Time")}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AssignTable;
