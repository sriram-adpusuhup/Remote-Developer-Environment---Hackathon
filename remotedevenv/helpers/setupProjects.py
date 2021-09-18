#!/usr/bin/python3

import json
import sys
import os
import shutil

def getConfig(path):
    config = {}
    with open(path, 'r') as f:
        config = json.load(f)
    return config

def copyConfig(workdir, projectName, configFilePath, configFileName):
    pathToConfigFile = "/etc/adpushup/configs/{}/{}".format(projectName, configFileName)
    shutil.copy(pathToConfigFile, "{}/{}/{}".format(workdir,projectName,configFilePath))
    

def setupProject(project, username, token, workdir):
    repositoryUrlTemplate = project['repositoryUrlTemplate']
    repositoryUrl = repositoryUrlTemplate.format(username=username, token=token)
    projectName = project['name']

    os.chdir(workdir)
    os.system("git clone {}".format(repositoryUrl))
    for config in project['configs']:
        copyConfig(workdir, projectName, config['path'], config['configFileName'])
    for cmd in project['cmds']:
        os.chdir("{}/{}".format(workdir, projectName))
        os.system(cmd)
    os.chdir(workdir)

def main():
    workdir = os.path.expanduser("~")
    config = getConfig(sys.argv[1])
    username = config['user']['username']
    token = config['user']['accessToken']
    projects = config['projects']
    for project in projects:
        setupProject(project, username, token, workdir)

if __name__=="__main__":
    main()
