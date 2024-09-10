export class ApiFeature {
    constructor(mongooseQuery,queryData) {
        
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }
    // pagination
    pagination() {
        const{page,size}= this.queryData
        if (!page || page<=1){
            page = 1
     
         }
         if (!size || size<=1){
             size = 3
      
          }
          page=parseInt(page)
          size=parseInt(size)
          const skip =(page - 1) * size

          this.mongooseQuery = this.mongooseQuery.skip(skip).limit(size)
          return this
    }
// sort
    sort() {
        let{sort}= this.queryData
        sort = sort?.replaceAll(',','')

        this.mongooseQuery = this.mongooseQuery.sort(sort)
        return this
    }
    // select
    select() {
        let{select}= this.queryData
        select = select?.replaceAll(',','')

        this.mongooseQuery = this.mongooseQuery.select(select)
        return this
    }
    // filter
    filter() {
        let {page , size, sort , select,...filter} = req.queryData
        filter=JSON.parse(JSON.stringify(filter).replace(/gt|gte|lt|lte/g,(match)=>`$${match}`))
        this.mongooseQuery = this.mongooseQuery.find(filter)
        this.queryData.metadata.size=this.mongooseQuery.countDocuments(filter)
        this.queryData.metadata.page=this.mongooseQuery
        return this
    }
}