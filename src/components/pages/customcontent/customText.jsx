
const CustomText = ( {data} ) => {  
  return (
      <div className="mt-4">
        <h3>{data? data.title : 'na'}</h3>
        <div dangerouslySetInnerHTML={{ __html: data? data : 'na' }} />
      </div>
  );
};

export default CustomText;
