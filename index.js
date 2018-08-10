const path = require('path')
const fs = require('fs')
const _filter = require('lodash/filter')
const _indexOf = require('lodash/indexOf')
const _map = require('lodash/map')

const resolve = path.resolve
const name = _ => path.basename(_)
const dir = _ => _.replace(new RegExp(name(_) + '$', 'i'), '')
const readdir = _ => fs.readdirSync(_)
const find = files => file => _indexOf(files, file) > -1
const lowerCaseAll = files => _map(files, f => f.toLowerCase())
const buildError = err => new Error(err)
console.log(resolve('./node_modules'))

const filter = request => request ? _filter(request.split('!'), r => r.indexOf('MAINTAIN') > -1) : false

const verify = (requests, errors) => requests.forEach(r => {
    r = resolve(r)
    const rs = readdir(dir(r))
    if (!find(rs)(name(r))) {
        // case not match
        // try lowercase match
        const i = lowerCaseAll(rs).indexOf(name(r).toLowerCase())
        if (i > -1) {
            // matched
            errors.push(buildError('Module-Case-Sensitive-Check-Webpack-Plugin. Bad case sensitivity usage found: "' + name(r) + '" => "' + rs[i] + '"'))
        } else {
            // not matched, file not exist?
        }
    }
})

class plugin {
    apply(compiler) {
        compiler.plugin('compilation', function (compilation) {
            compilation.plugin('build-module', function ({userRequest}) {
                userRequest = filter(userRequest)
                if (userRequest.length) {
                    verify(userRequest, compilation.errors)
                }
            })
        })
    }
}

module.exports = plugin
