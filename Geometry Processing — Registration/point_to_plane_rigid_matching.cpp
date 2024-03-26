#include "point_to_plane_rigid_matching.h"
#include "closest_rotation.h"
#include <Eigen/Dense>


void point_to_plane_rigid_matching(
  const Eigen::MatrixXd & X,
  const Eigen::MatrixXd & P,
  const Eigen::MatrixXd & N,
  Eigen::Matrix3d & R,
  Eigen::RowVector3d & t)
{
	//A B
	Eigen::MatrixXd A, B;
	A = Eigen::MatrixXd::Zero(6, 6);
	B = Eigen::MatrixXd::Zero(6, 1);

	for (int i = 0; i < X.rows(); i++) {
		Eigen::Vector3d xi = X.row(i).transpose();
		Eigen::Vector3d ni = N.row(i).transpose();
		Eigen::Vector3d pi = P.row(i).transpose();

		
		Eigen::MatrixXd xini;
		xini.resize(6, 1);
		xini << xi.cross(ni), ni;
		A += xini * (xini.transpose());
		B += xini * ni.transpose() * (pi - xi);
		
	}

	Eigen::VectorXd u = A.colPivHouseholderQr().solve(B);
	u = u.transpose();
	
	Eigen::MatrixXd M;
	M.resize(3, 3);
	M << 1, -u(2), u(1),
		u(2), 1, -u(0),
		-u(1), u(0), 1;
	
	
	closest_rotation(M.transpose(), R);

	t << u(3), u(4), u(5);

}
