#include "point_to_point_rigid_matching.h"
#include "closest_rotation.h"
#include <iostream>

void point_to_point_rigid_matching(
	const Eigen::MatrixXd& X,
	const Eigen::MatrixXd& P,
	Eigen::Matrix3d& R,
	Eigen::RowVector3d& t)
{
	// t = p - Rx
	Eigen::RowVector3d p = P.colwise().mean();
	Eigen::RowVector3d x = X.colwise().mean();


	Eigen::MatrixXd X_d, P_d, M;
	X_d = X - Eigen::MatrixXd::Ones(X.rows(), 1) * x;
	P_d = P - Eigen::MatrixXd::Ones(P.rows(), 1) * p;

	M = P_d.transpose() * X_d;

	
	closest_rotation(M.transpose(), R);
	t = (p.transpose() - R * x.transpose()).transpose();
}


