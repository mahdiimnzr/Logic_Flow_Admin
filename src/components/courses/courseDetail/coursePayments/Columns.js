import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { useTranslation } from "react-i18next";
import ImageFallback from "../../../common/ImageFallback";
import userImage from "/Profile.png";
import formatPrice from "../../../../core/utils/formatPrice";
import formatDate from "../../../../core/utils/formatDate";

export const columns = [
  {
    name: "StudentName",
    sortable: true,
    minWidth: "200px",
    sortField: "fName",
    selector: (row) => row.user?.fName,
    cell: (row) => (
      <div className="d-flex align-items-center gap-1">
        <ImageFallback
          style={{ borderRadius: "100%", width: "32px", height: "32px" }}
          fallback={userImage}
          src={row.user?.imageAddress}
        />
        <Link
          to={`/Users/Detail/${row.studentId}`}
          className="user_name text-body text-truncate"
        >
          <span className="fw-bolder">
            {row.user?.fName} {row.user?.lName}
          </span>
        </Link>
      </div>
    ),
  },
  {
    name: "GroupName",
    sortable: true,
    minWidth: "150px",
    sortField: "groupName",
    selector: (row) => row.courseGroup?.groupName,
    cell: (row) => (
      <span className="fw-bolder">{row.courseGroup?.groupName ?? "-"}</span>
    ),
  },
  {
    name: "PaymentAmount",
    sortable: true,
    minWidth: "150px",
    sortField: "paid",
    selector: (row) => row.payment?.Paid,
    cell: (row) => {
      const { t } = useTranslation();
      return (
        <span className="fw-bolder">
          {row.payment
            ? formatPrice(Number(row.payment.Paid)) + " " + t("Toman")
            : "-"}
        </span>
      );
    },
  },
  {
    name: "PaymentStatus",
    sortable: true,
    minWidth: "130px",
    sortField: "accept",
    selector: (row) => row.payment?.accept,
    cell: (row) => {
      const { t } = useTranslation();
      return row.payment ? (
        <Badge
          className="text-capitalize"
          color={row.payment.accept ? "light-success" : "light-secondary"}
          pill
        >
          {row.payment.accept ? t("PaymentAccepted") : t("PaymentPending")}
        </Badge>
      ) : (
        <Badge className="text-capitalize" color="light-warning" pill>
          {t("NoPayment")}
        </Badge>
      );
    },
  },
  {
    name: "PaymentDate",
    sortable: true,
    minWidth: "150px",
    sortField: "PeymentDate",
    selector: (row) => row.payment?.PeymentDate,
    cell: (row) => (
      <span className="fw-bolder">
        {row.payment ? formatDate(row.payment.PeymentDate) : "-"}
      </span>
    ),
  },
];
