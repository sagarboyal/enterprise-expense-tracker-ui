const Status = ({ text, icon: Icon, bg, color }) => {
  return (
    <div
      className={`flex items-center justify-center gap-1 px-2 py-1 rounded-md ${bg} ${color}`}
    >
      <Icon className={`text-${color}`} size={15} />
      <span className={`text-${color} text-sm font-medium`}>{text}</span>
    </div>
  );
};

export default Status;
