class APIFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    search(){
        const keyword=this.queryStr.keyword?{name:{
            $regex:this.queryStr.keyword,
            $options:'i'
        }}:{}
        this.query.find(keyword)
        return this;
    }  
    filter(){
        
        // Create a copy of queryStr
        let queryStrCopy = { ...this.queryStr };
        
        // Fields to be removed from the query
        const removeFields = ['keyword', 'limit', 'page'];
    
        // Remove specified fields from the copied query object
        removeFields.forEach(field => delete queryStrCopy[field]);
    
        // Use the remaining fields to find the query
        this.query.find(queryStrCopy);
    
        return this;
    } 
    
    paginate(resPerPage){
        const currentPage=Number(this.queryStr.page) ||1 ;
        const skip=resPerPage*(currentPage-1);
        this.query.limit(resPerPage).skip(skip);
         
        return this;
    }
}

module.exports=APIFeatures;
/*return this; statement is included to allow method chaining. 
Method chaining is a technique where multiple methods can be 
called on the same object consecutively */


