import ProspekKarirClient from "./prospek-karir-client";

interface ProspekKarirProps {
  data?: any;
  isEmpty?: boolean;
  prodiNama?: string;
}

const ProspekKarir = ({ data, isEmpty, prodiNama }: ProspekKarirProps) => {
  return <ProspekKarirClient data={data} isEmpty={isEmpty} prodiNama={prodiNama} />;
};

export default ProspekKarir;
