const FormField = ({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  autoComplete,
  classLabel,
  classInput,
}) => {
  return (
    <>
      <label className={`${classLabel} text-primaryh1`}>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={autoComplete}
        className={classInput}
      />
    </>
  );
};

export default FormField;
