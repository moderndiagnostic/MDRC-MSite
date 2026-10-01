import { readFileSync } from "fs";
import path from "path";
import "./chronic-endometritis-panel.css";
import CepClient from "./CepClient";

const TITLE = "Chronic Endometritis Panel | MDRC";
const DESCRIPTION =
  "CD138 immunohistochemistry and an 11-target multiplex RT-PCR panel, reported together for chronic endometritis.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function ChronicEndometritisPanelPage() {
  const html = readFileSync(
    path.join(process.cwd(), "src/app/chronic-endometritis-panel/cep-body.html"),
    "utf8",
  );

  return <CepClient html={html} />;
}
