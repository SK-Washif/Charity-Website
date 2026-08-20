export default function TextAreaField({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="label-caps mb-1 block" htmlFor={props.id ?? props.name}>
        {label}
      </label>
      <textarea
        id={props.id ?? props.name}
        {...props}
        className="w-full rounded-sm border border-line bg-paper px-3 py-2 font-body text-sm text-ink outline-none transition-colors focus:border-stamp"
      />
    </div>
  );
}
