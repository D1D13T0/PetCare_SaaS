interface Props {
  title: string;
  value: number;
}

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-semibold text-gray-800 mt-2">
        {value}
      </h2>
    </div>
  );
}