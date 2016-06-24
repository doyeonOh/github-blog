/**
 * Created by mayaj on 2016-06-25.
 */
const path = require('path');
const http = require('http');
const Url = require('url');
const childProcess = require('child_process');

/**
 * 1. 빌드 및 디폴로이를 한다.
 */
childProcess.exec("hexo g -d", (err, stdout, e) => {
    if(err) console.error(err);
    console.log(`1. 빌드 및 디폴로이
    ${stdout}`);
    if(stdout) {
        childProcess.exec("git add .", (err, stdout) => {
            if(err) console.error(errp);
            console.log(`2. git addp
            ${stdout}`);
            childProcess.exec(`git commit -m "update"`, (err) => {
                if(err) console.error(err);
                console.log(`3. git commit
                ${stdout}`);
                childProcess.exec(`git push`, (err) => {
                    if(err) console.error(err);
                    console.log(`4. git push
                    ${stdout}`);
                })
            })
        })
    }
});
