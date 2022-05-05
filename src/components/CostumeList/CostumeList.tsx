import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import costumesService from "../../services/costumesService";
import { formatErrorAsString } from "../../services/helpersService";
import { Costume, CostumeURLSearchParams } from "../../types";
import AlertNotification from "../AlertNotification/AlertNotification";
import useAlertNotification from "../AlertNotification/useAlertNotification";
import CLSearchForm, { CLSearchValues } from "./CLSearchForm";
import CostumesTable from "../CostumesTable/CostumesTable";
import { useTitle } from "../../hooks/useTitle";
// import { APP_TITLE } from "../../constants";

interface CostumeListProps {
  title?: string;
  // creating set related props
  isCreatingSet?: boolean;
  handleCosCheckChange?: (costumeChanged: Costume) => void;
  costumesInSet?: Costume[];
}

const CostumeList = ({
  title,
  isCreatingSet = false,
  handleCosCheckChange = undefined,
  costumesInSet = [],
}: CostumeListProps) => {
  const { setTitle } = useTitle(title);
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const { setErrorMsg, ...notif } = useAlertNotification();
  const [searchParams, setSearchParams] = useSearchParams();
  const [count, setCount] = useState<number>(-1);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([10, 25, 100]);
  const [loading, setLoading] = useState<boolean>(true);

  // for CostumesTable
  const pageParam = searchParams.get("page");
  const rowsParam = searchParams.get("rows");
  // for CLSearchForm
  const itemIdParam = searchParams.get("itemId");
  const nameParam = searchParams.get("name");
  const equipSlotsParam = searchParams.get("equipSlots");

  const depArr = isCreatingSet ? [] : [searchParams];

  useEffect(() => {
    if (title) {
      setTitle(title + " " + searchParams.toString());
    }
    void getCostumes(getURLParams());
  }, depArr);

  const getURLParams = (): CostumeURLSearchParams => {
    const params: CostumeURLSearchParams = {};
    if (pageParam !== null) params.page = pageParam;
    if (rowsParam !== null) params.rows = rowsParam;
    if (itemIdParam !== null) params.itemId = itemIdParam;
    if (nameParam !== null) params.name = nameParam;
    if (equipSlotsParam !== null) params.equipSlots = equipSlotsParam;
    return params;
  };

  const initialFormValues: CLSearchValues = {
    itemId: "",
    name: "",
    equipSlots: [],
  };

  const formValues: CLSearchValues = {
    itemId: itemIdParam ?? initialFormValues.itemId,
    name: nameParam ?? initialFormValues.name,
    equipSlots: equipSlotsParam
      ? equipSlotsParam.split(",")
      : initialFormValues.equipSlots,
  };

  // check if the rowsParam is one of the options else you get an empty option displayed
  const rowsPerPage = (() => {
    if (rowsParam && !isNaN(+rowsParam)) {
      if (rowsPerPageOptions.includes(+rowsParam)) {
        return +rowsParam;
      }
    }
    return rowsPerPageOptions[0];
  })();

  // keep page prop within range of count
  const page = (() => {
    if (pageParam && !isNaN(+pageParam)) {
      if (+pageParam * rowsPerPage < count) {
        return +pageParam;
      }
    }
    return 0;
  })();

  const getCostumes = async (newSearchParams: CostumeURLSearchParams) => {
    try {
      setLoading(true);
      const response = await costumesService.getAll(newSearchParams);
      setCostumes(response.costumes);
      setCount(response.count);
      setRowsPerPageOptions(response.rowsOptions);
      if (isCreatingSet) {
        setSearchParams({ ...response.correctedParams }, { replace: true });
      }
    } catch (error) {
      setErrorMsg(formatErrorAsString(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFormValues: CLSearchValues) => {
    const newSearchParams: CostumeURLSearchParams = {
      page: "0",
    };
    if (newFormValues.name !== initialFormValues.name)
      newSearchParams.name = newFormValues.name;
    if (newFormValues.itemId !== initialFormValues.itemId)
      newSearchParams.itemId = newFormValues.itemId;
    if (newFormValues.equipSlots.length !== 0)
      newSearchParams.equipSlots = newFormValues.equipSlots.join(",");
    setSearchParams({ ...newSearchParams });
    if (isCreatingSet) {
      void getCostumes(newSearchParams);
    }
  };

  const handleReset = () => {
    const newSearchParams = { page: "0" };
    setSearchParams(newSearchParams);
    if (isCreatingSet) {
      void getCostumes(newSearchParams);
    }
  };

  const onPageChange = (newPage: number) => {
    const newSearchParams = { ...getURLParams(), page: newPage.toString() };
    setSearchParams({ ...newSearchParams });
    if (isCreatingSet) {
      void getCostumes(newSearchParams);
    }
  };

  const onChangeRowsPerPage = (newRowsPer: number) => {
    const newSearchParams = {
      ...getURLParams(),
      page: "0",
      rows: newRowsPer.toString(),
    };
    setSearchParams({ ...newSearchParams });
    if (isCreatingSet) {
      void getCostumes(newSearchParams);
    }
  };

  return (
    <>
      <Typography mb={1} variant="h5">
        Costumes
      </Typography>
      <AlertNotification {...notif}></AlertNotification>
      <CLSearchForm
        handleSearch={handleSearch}
        handleReset={handleReset}
        initialValues={formValues}
        loading={loading}
      ></CLSearchForm>
      {loading && <LinearProgress />}
      <CostumesTable
        costumes={costumes}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        count={count}
        rowsPerPageOptions={rowsPerPageOptions}
        isCreatingSet={isCreatingSet}
        handleCosCheckChange={handleCosCheckChange}
        costumesInSet={costumesInSet}
      ></CostumesTable>
    </>
  );
};

export default CostumeList;
