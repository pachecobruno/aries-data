// export default function sparkS3Input(fileName) {
//     // Return a decorator.
//     return function(target, key, descriptor) {
//         // Copy of the original function.
//         const callback = descriptor.value;

//         const start = process.hrtime();

//         const { sqlContext, sqlFunctions }
//             = spark(['--master', 'spark://schniebot:7077']);

//         const df = sqlContext.read()
//             .jsonSync(this.s3Path());

//         this.log.debug(ctx.collectSync());

//         this.log.debug(process.hrtime(start));
//     };
// };
"use strict";