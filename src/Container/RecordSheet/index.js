import React from "react";
import { Box } from "@mui/material";
import classNames from "classnames";
import { getIDietBgColor } from "../../utils";

const RecordTableTemplate = ({
  date = "",
  idx = "",
  title = "",
  dietContent = "",
  iDiet = "",
  remarks = {},
}) => {
  const { iVal, dVal, pcVal } = remarks;
  return (
    <Box className="border-l-2 border-black w-full">
      <Box className="">
        <Box
          className="flex border-b-2 border-black text-white"
          style={{ backgroundColor: "#2A4479" }}
        >
          <Box className="py-2 text-xs">{title}</Box>
        </Box>
        <Box
          className={classNames(
            "grid divide-x-2 text-white grid-cols-3"
          )}
          style={{ backgroundColor: "#2A4479" }}
        >
          <Box className="py-2 text-xs !border-0">飲食內容</Box>
          <Box className="py-2 text-xs border-black">iDiet</Box>
          <Box className="py-2 text-xs border-black">備註</Box>
        </Box>
      </Box>
      <Box
        className={classNames(
          "grid grow border-t-2 border-black divide-x-2 divide-dashed h-60 grid-cols-3"
        )}
      >

        <Box className="flex grow p-x break-all overflow-auto">
          {dietContent}
        </Box>
        <Box
          className="flex items-center grow p-px"
          style={{
            backgroundColor: iDiet ? getIDietBgColor(iDiet) : "",
            color: iDiet > 10 ? "red" : "black",
          }}
        >
          {iDiet || ""}
        </Box>
        <Box className="grow divide-y divide-dashed">
          <Box className="h-1/5 flex items-center p-px">{iVal && "i"}</Box>
          <Box className="grow flex items-center p-px">
            {`${dVal ? "D" : ""}${dVal && pcVal ? "," : ""}${pcVal ? "PC" : ""
              }`}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function RecordSheet({ date = "", records = [] }) {
  return (
    <Box className="mt-4 flex justify-center items-center">
      <Box className="border-2 border-black w-full">
        <Box className="flex">
          <Box className="flex-none  w-10 text-white text-xs border-black">

            <Box className="w-full py-2  border-b-2 border-black" style={{ backgroundColor: "#2A4479" }}>餐別</Box>
            <Box className="py-2  border-b-2 border-black" style={{ backgroundColor: "#2A4479" }}>日期</Box>
            <Box className="flex items-center h-60  border-black" style={{ backgroundColor: "#2A4479" }}>{date}</Box>

          </Box>
          <Box className="w-full grid grid-cols-5">
            {records.map((item, idx) => {
              const { title, dietContent, iDiet, remarks } = item;
              return (
                <RecordTableTemplate
                  date={date}
                  key={idx}
                  idx={idx}
                  title={title}
                  dietContent={dietContent}
                  iDiet={iDiet}
                  remarks={remarks}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default RecordSheet;
