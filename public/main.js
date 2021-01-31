function sortByKickOff(a, b) {
    if (a.kickoff_time < b.kickoff_time) {
        return -1;
    }
    if (a.kickoff_time > b.kickoff_time) {
        return 1;
    }
    return 0;
}

function getTeamsData(data) {
    let teamsData = null;
    console.log('data', data)
    teamsData = data.generalData.teams.map(team => {
        let teamResults = data.fixturesData.filter(fixture => fixture.finished && (fixture.team_a == team.id || fixture.team_h == team.id))
            .sort(sortByKickOff) // Sorting by kickoff date just to be sure 
            .map(fixture => {
                let { team_a, team_h, team_a_score, team_h_score } = fixture;
                if (team_a == team.id && team_a_score > team_h_score || team_h == team.id && team_h_score > team_a_score) return 'W';
                if (team_a == team.id && team_a_score < team_h_score || team_h == team.id && team_h_score < team_a_score) return 'L';
                return 'D';
            }).join('')
        return { name: team.name, results: teamResults }
    });
    console.log('teamsData', teamsData)
    return teamsData
}

function teamWaitingForDraw(data) {
    let teamsData = getTeamsData(data);
    let drawData = teamsData.map(team => {
        let { name, results } = team;
        return {
            name,
            results,
            totalDraw: team.results.split('D').length - 1,
            gamesWithNoDraw: team.results.length - 1 - team.results.lastIndexOf('D')
        }
    }).sort((team1, team2) => team2.gamesWithNoDraw - team1.gamesWithNoDraw);
    return drawData;
}

function teamWaitingForWin(data) {
    let teamsData = getTeamsData(data);
    let winData = teamsData.map(team => {
        let { name, results } = team;
        return {
            name,
            results,
            totalWin: team.results.split('W').length - 1,
            gamesWithNoWin: team.results.length - 1 - team.results.lastIndexOf('W')
        }
    }).sort((team1, team2) => team2.gamesWithNoWin - team1.gamesWithNoWin);
    return winData;
}




